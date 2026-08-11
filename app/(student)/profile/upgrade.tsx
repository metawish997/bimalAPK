import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { subscriptionService } from '../../../src/services/subscriptionService';
import { useAuthStore } from '../../../src/store/useAuthStore';

export default function UpgradeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const shimmerValue = useRef(new Animated.Value(0)).current;
  const [plans, setPlans] = useState<any[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  // Expo Go WebView Fallback States
  const [showWebCheckout, setShowWebCheckout] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState('');
  const [currentCheckoutPlan, setCurrentCheckoutPlan] = useState<any>(null);

  // Custom Alert State
  const [alertConfig, setAlertConfig] = useState<{ visible: boolean; title: string; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, title: '', message: '', type: 'info' });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertConfig({ visible: true, title, message, type });
  };
  const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

  useEffect(() => {
    const startShimmer = () => {
      shimmerValue.setValue(0);
      Animated.loop(
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        })
      ).start();
    };
    startShimmer();

    const fetchData = async () => {
      try {
        const [plansRes, subsRes] = await Promise.all([
          subscriptionService.getPlans(),
          subscriptionService.getMySubscriptions()
        ]);

        const activePlans = plansRes.data?.data?.filter((p: any) => p.is_active) || [];
        activePlans.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
        setPlans(activePlans);

        const mySubs = subsRes.data?.data || [];
        const activePlanIds = mySubs
          .filter((sub: any) => sub.status === 'active' && new Date(sub.end_date) > new Date())
          .map((sub: any) => sub.subscription_plan?._id || sub.subscription_plan);
        setActiveSubscriptions(activePlanIds);

      } catch (error) {
        console.error('Failed to fetch subscription data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const shimmerTranslateX = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-180, 220],
  });

  const handleCheckout = async (plan: any) => {
    try {
      setProcessingPlanId(plan._id);

      // 1. Create Order on Backend
      const orderRes = await subscriptionService.createOrder(plan._id);
      const orderData = orderRes.data;

      if (!orderData.success) {
        if (orderData.message?.includes('KYC')) {
          showAlert('KYC Required', orderData.message, 'error');
        } else {
          showAlert('Error', orderData.message || 'Failed to initialize checkout', 'error');
        }
        return;
      }

      // If it's a free plan, backend activates it directly
      if (orderData.isFree) {
        showAlert('Success', 'Free subscription activated successfully!', 'success');
        setActiveSubscriptions(prev => [...prev, plan._id]);
        return;
      }

      // 2. Open WebView Modal (Expo Go fallback for Razorpay)
      setCurrentCheckoutPlan(plan);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>body { background-color: #000; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }</style>
        </head>
        <body>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          <script>
            var options = {
              "key": "${orderData.keyId}",
              "amount": "${orderData.amount}",
              "currency": "${orderData.currency}",
              "name": "Bimal Institute",
              "description": "Upgrade to ${plan.name}",
              "image": "https://i.imgur.com/3g7nmJC.png",
              "order_id": "${orderData.orderId}",
              "theme": { "color": "#A8FF3E" },
              "prefill": {
                "name": "${user?.name || user?.firstName || ''}",
                "email": "${user?.email || ''}",
                "contact": "${(user as any)?.mobile || (user as any)?.phone || ''}"
              },
              "handler": function (response) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'success', data: response }));
              }
            };
            options.modal = {
              ondismiss: function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'dismissed' }));
              }
            };
            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response){
                window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'error', data: response.error }));
            });
            rzp1.open();
          </script>
        </body>
        </html>
      `;

      setCheckoutHtml(htmlContent);
      setShowWebCheckout(true);

    } catch (error: any) {
      console.error('Initialize Checkout Error:', error);
      showAlert('Error', 'An error occurred during the checkout initialization.', 'error');
      setProcessingPlanId(null);
    }
  };

  const handleWebMessage = async (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);

      if (msg.event === 'dismissed') {
        setShowWebCheckout(false);
        setProcessingPlanId(null);
        setTimeout(() => {
          showAlert('Payment Cancelled', 'You cancelled the payment process.', 'info');
        }, 400);
        return;
      }

      if (msg.event === 'error') {
        setShowWebCheckout(false);
        setProcessingPlanId(null);
        setTimeout(() => {
          showAlert('Payment Failed', msg.data?.description || 'Transaction failed', 'error');
        }, 400);
        return;
      }

      if (msg.event === 'success') {
        setShowWebCheckout(false); // hide webview

        // 3. Verify Payment Signature on Backend
        const paymentResult = msg.data;
        const verifyRes = await subscriptionService.verifyPayment({
          razorpay_order_id: paymentResult.razorpay_order_id,
          razorpay_payment_id: paymentResult.razorpay_payment_id,
          razorpay_signature: paymentResult.razorpay_signature,
          planId: currentCheckoutPlan._id
        });

        if (verifyRes.data.success) {
          setTimeout(() => {
            showAlert('Success', 'Subscription activated successfully! Welcome to the matrix.', 'success');
          }, 400);
          setActiveSubscriptions(prev => [...prev, currentCheckoutPlan._id]);
        } else {
          setTimeout(() => {
            showAlert('Payment Failed', 'Transaction verification failed.', 'error');
          }, 400);
        }
      }
    } catch (err) {
      console.error('Webhook error processing:', err);
      setTimeout(() => {
        showAlert('Error', 'Could not verify payment.', 'error');
      }, 400);
    } finally {
      if (!showWebCheckout) {
        setProcessingPlanId(null);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Upgrade Node</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Unlock premium asset courses, live streams, and advanced execution metrics analytics.</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#A8FF3E" style={{ marginTop: 40 }} />
        ) : (
          plans.map((plan, index) => {
            const isFeatured = plan.is_featured;
            const isOwned = activeSubscriptions.includes(plan._id);
            const isProcessing = processingPlanId === plan._id;

            // Alternating accent colors for premium look
            const accentColor = isFeatured ? '#FB923C' : (index % 2 === 0 ? '#A8FF3E' : '#38bdf8');
            const price = plan.sale_price > 0 ? plan.sale_price : plan.price;

            return (
              <View key={plan._id} style={[styles.planCard, { borderColor: accentColor }]}>
                {isOwned ? (
                  <View style={[styles.recommendedBadge, { borderColor: accentColor, right: undefined, left: 16 }]}>
                    <Text style={[styles.recommendedText, { color: accentColor }]}>ALREADY SUBSCRIBED</Text>
                  </View>
                ) : plan.badge ? (
                  <View style={[styles.recommendedBadge, { borderColor: accentColor }]}>
                    <Text style={[styles.recommendedText, { color: accentColor }]}>{plan.badge.toUpperCase()}</Text>
                  </View>
                ) : null}

                <Text style={[styles.planName, { color: accentColor }]}>{plan.name}</Text>
                <Text style={styles.planPrice}>
                  {plan.currency === 'USD' ? '$' : '₹'}{price.toLocaleString()}
                  <Text style={styles.pricePeriod}> / {plan.plan_duration}</Text>
                </Text>

                <View style={styles.featureList}>
                  {plan.features?.map((feature: string, fIdx: number) => (
                    <View key={fIdx} style={styles.featureRow}>
                      <MaterialIcons name="check" size={14} color={accentColor} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                  {/* Fallback feature if empty array */}
                  {(!plan.features || plan.features.length === 0) && (
                    <View style={styles.featureRow}>
                      <MaterialIcons name="check" size={14} color={accentColor} />
                      <Text style={styles.featureText}>{plan.description}</Text>
                    </View>
                  )}
                </View>

                {isOwned ? (
                  <TouchableOpacity style={[styles.disabledButton, { borderColor: accentColor, backgroundColor: 'rgba(0,0,0,0.5)' }]} disabled>
                    <Text style={[styles.disabledButtonText, { color: accentColor }]}>Current Active Node</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[styles.selectButton, { backgroundColor: accentColor, opacity: isProcessing ? 0.7 : 1 }]}
                    activeOpacity={0.8}
                    disabled={isProcessing || !!processingPlanId}
                    onPress={() => handleCheckout(plan)}
                  >
                    {!isProcessing && (
                      <Animated.View
                        style={[
                          styles.buttonShimmerWave,
                          { transform: [{ translateX: shimmerTranslateX }, { rotate: '20deg' }] }
                        ]}
                      />
                    )}
                    {isProcessing ? (
                      <ActivityIndicator size="small" color="#000000" />
                    ) : (
                      <Text style={[styles.selectText, { color: '#000000' }]}>Upgrade to {plan.name}</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}

      </ScrollView>

      {/* Expo Go WebView Modal Fallback for Razorpay */}
      <Modal visible={showWebCheckout} animationType="slide" transparent={false}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {
              setShowWebCheckout(false);
              setProcessingPlanId(null);
            }} style={styles.backButton}>
              <MaterialIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Secure Checkout</Text>
            <View style={{ width: 40 }} />
          </View>
          {checkoutHtml ? (
            <WebView
              source={{ html: checkoutHtml }}
              onMessage={handleWebMessage}
              style={{ flex: 1, backgroundColor: '#000' }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              originWhitelist={['*']}
            />
          ) : null}
        </SafeAreaView>
      </Modal>

      {/* Custom Sleek Alert Modal (SweetAlert Style) */}
      <Modal visible={alertConfig.visible} animationType="fade" transparent={true}>
        <View style={styles.alertOverlay}>
          <View style={[
            styles.alertBox,
            { borderColor: alertConfig.type === 'success' ? '#A8FF3E' : alertConfig.type === 'error' ? '#FF5252' : '#FB923C' }
          ]}>
            <View style={styles.alertIconContainer}>
              {alertConfig.type === 'success' && <MaterialIcons name="check-circle-outline" size={70} color="#A8FF3E" />}
              {alertConfig.type === 'error' && <MaterialIcons name="error-outline" size={70} color="#FF5252" />}
              {alertConfig.type === 'info' && <MaterialIcons name="info-outline" size={70} color="#FB923C" />}
            </View>

            <Text style={[
              styles.alertTitle,
              { color: alertConfig.type === 'success' ? '#A8FF3E' : alertConfig.type === 'error' ? '#FF5252' : '#FB923C' }
            ]}>
              {alertConfig.title}
            </Text>

            <Text style={styles.alertMessage}>{alertConfig.message}</Text>

            <TouchableOpacity
              style={[
                styles.alertButton,
                { backgroundColor: alertConfig.type === 'success' ? '#A8FF3E' : alertConfig.type === 'error' ? '#FF5252' : '#FB923C' }
              ]}
              onPress={hideAlert}
              activeOpacity={0.8}
            >
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#141414',
  },
  backButton: {
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: -0.2,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 28,
    lineHeight: 18,
  },
  planCard: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  proCard: {
    borderColor: '#FB923C',
  },
  eliteCard: {
    borderColor: '#A8FF3E',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -9,
    right: 16,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FB923C',
    borderRadius: 4,
  },
  recommendedText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FB923C',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  eliteBadge: {
    position: 'absolute',
    top: -9,
    right: 16,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#A8FF3E',
    borderRadius: 4,
  },
  eliteBadgeText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#A8FF3E',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -0.1,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  pricePeriod: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '400',
  },
  featureList: {
    gap: 10,
    marginBottom: 20,
    paddingTop: 4,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureText: {
    fontSize: 13,
    color: '#888888',
    flex: 1,
    lineHeight: 16,
  },
  selectButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative', // Constrains absolute nested children boundaries
    overflow: 'hidden', // Clips absolute masks neatly inside rounded radius paths
  },
  selectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    zIndex: 2, // Keeps text rendering cleanly above shimmer flow layers
  },
  buttonShimmerWave: {
    position: 'absolute',
    top: -24,
    bottom: -24,
    width: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.35)', // High-density glossy linear sweeping light strip
    zIndex: 1,
  },
  disabledButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#141414',
    backgroundColor: '#0A0A0A',
  },
  disabledButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444444',
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  alertBox: {
    width: '85%',
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  alertIconContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 15,
    color: '#E5E5E5',
    lineHeight: 22,
    marginBottom: 28,
    opacity: 0.9,
    textAlign: 'center',
  },
  alertButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});