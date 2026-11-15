import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    // headerTransparent: false keeps the header solid on iOS 26, so screens start below it
    <Stack screenOptions={{ headerTransparent: false }}>
      <Stack.Screen name="index" options={{ title: 'CALABARZON Tour' }} />
      <Stack.Screen name="destinations/index" options={{ title: 'Destinations' }} />
      <Stack.Screen name="destinations/[id]" options={{ title: 'Destination Details' }} />
      <Stack.Screen name="destinations/add" options={{ title: 'Add Destination' }} />
      <Stack.Screen name="destinations/edit/[id]" options={{ title: 'Edit Destination' }} />
    </Stack>
  );
}
