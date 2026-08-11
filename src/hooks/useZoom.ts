import { useState, useCallback } from 'react';
import { Alert, Linking } from 'react-native';

export const useZoom = () => {
  const [isInitialized, setIsInitialized] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  /**
   * Helper function to open Zoom via Deep Link
   */
  const openZoomApp = async (meetingNumber: string, meetingPassword?: string, userName: string = 'Participant') => {
    setIsInitializing(true);
    try {
      // Create the deep link for Zoom
      // Format: zoomus://zoom.us/join?confno=123456789&pwd=password&uname=Name
      const zoomScheme = `zoomus://zoom.us/join?confno=${meetingNumber}&pwd=${meetingPassword || ''}&uname=${encodeURIComponent(userName)}`;
      
      const supported = await Linking.canOpenURL(zoomScheme);
      
      if (supported) {
        await Linking.openURL(zoomScheme);
      } else {
        // Fallback to web browser if Zoom app is not installed
        const webUrl = `https://zoom.us/wc/join/${meetingNumber}`;
        await Linking.openURL(webUrl);
      }
    } catch (error: any) {
      console.error('Zoom Join Error:', error);
      Alert.alert('Zoom Error', 'Could not open the Zoom app. Please ensure it is installed.');
    } finally {
      setIsInitializing(false);
    }
  };

  /**
   * Join an existing meeting as a participant
   */
  const joinMeeting = useCallback(async (
    meetingNumber: string,
    meetingPassword?: string,
    userName: string = 'Participant'
  ) => {
    await openZoomApp(meetingNumber, meetingPassword, userName);
  }, []);

  /**
   * Start a meeting as the host
   */
  const startMeeting = useCallback(async (
    meetingNumber: string,
    userName: string = 'Host'
  ) => {
    // For Expo Go fallback, we treat start meeting same as join meeting
    // Real host powers would require native SDK or signing in manually on the Zoom app
    await openZoomApp(meetingNumber, '', userName);
  }, []);

  return {
    isInitialized,
    isInitializing,
    joinMeeting,
    startMeeting,
  };
};
