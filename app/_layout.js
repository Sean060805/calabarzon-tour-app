import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';

// From iOS 26, the iPhone puts header buttons inside a light "glass" circle.
// White text can't be read on it, so the button text is green there and white everywhere else.
const onGlass = Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 26;

export default function RootLayout() {
  return (
    <>
      {/* Light (white) clock and battery icons, to show up on the green header */}
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          // A solid header color; without one, iOS 26 makes the header see-through
          headerTransparent: false,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'CALABARZON Tour' }} />
        <Stack.Screen
          name="destinations/index"
          options={{
            title: 'Destinations',
            headerRight: () => (
              <Pressable onPress={() => router.push('/destinations/add')} hitSlop={10}>
                <Text style={styles.headerButton}>+ Add</Text>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen name="destinations/[id]" options={{ title: 'Destination Details' }} />
        <Stack.Screen name="destinations/add" options={{ title: 'Add Destination' }} />
        <Stack.Screen name="destinations/edit/[id]" options={{ title: 'Edit Destination' }} />
        <Stack.Screen name="destinations/tour/[id]" options={{ title: 'Virtual Tour' }} />
        <Stack.Screen name="destinations/stops/[id]" options={{ title: 'Tour Photos' }} />
        <Stack.Screen name="destinations/quiz/[id]" options={{ title: 'Quiz' }} />
        <Stack.Screen name="destinations/questions/[id]" options={{ title: 'Quiz Questions' }} />
        <Stack.Screen name="progress" options={{ title: 'My Progress' }} />
        <Stack.Screen name="credits" options={{ title: 'Sources and Credits' }} />
        <Stack.Screen name="settings" options={{ title: 'App Settings' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    color: onGlass ? colors.primary : colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
