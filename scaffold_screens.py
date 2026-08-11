import os

routes = [
    "app/_layout.tsx",
    "app/index.tsx",
    "app/(auth)/_layout.tsx",
    "app/(auth)/onboarding.tsx",
    "app/(auth)/login.tsx",
    "app/(auth)/otp-verification.tsx",
    "app/(auth)/register.tsx",
    "app/(guest)/_layout.tsx",
    "app/(guest)/home.tsx",
    "app/(guest)/courses/index.tsx",
    "app/(guest)/journal.tsx",
    "app/(guest)/community.tsx",
    "app/(guest)/profile.tsx",
    "app/(student)/_layout.tsx",
    "app/(student)/dashboard.tsx",
    "app/(student)/learn/index.tsx",
    "app/(student)/learn/live-classes.tsx",
    "app/(student)/journal/index.tsx",
    "app/(student)/journal/add-trade.tsx",
    "app/(student)/journal/analytics.tsx",
    "app/(student)/ai-coach/index.tsx",
    "app/(student)/profile/index.tsx",
    "app/(student)/profile/kyc.tsx",
    "app/(student)/profile/subscription.tsx",
    "app/(modals)/_layout.tsx",
    "app/(modals)/notification-center.tsx",
    "app/(modals)/leaderboard.tsx",
    "app/(modals)/settings.tsx",
]

template = """import React from 'react';
import {{ View, Text, StyleSheet }} from 'react-native';

export default function {name}() {{
  return (
    <View style={{styles.container}}>
      <Text style={{styles.text}}>{name} Screen</Text>
    </View>
  );
}}

const styles = StyleSheet.create({{
  container: {{ flex: 1, backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' }},
  text: {{ color: '#A8FF3E', fontSize: 20 }}
}});
"""

for route in routes:
    os.makedirs(os.path.dirname(route), exist_ok=True)
    name = os.path.basename(route).replace(".tsx", "").replace("-", "").capitalize()
    if name == "Index":
        name = os.path.basename(os.path.dirname(route)).capitalize() + "Index"
    with open(route, "w") as f:
        f.write(template.format(name=name))

print("Scaffolded screens successfully.")
