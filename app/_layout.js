import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text } from 'react-native';
import colors from '../constants/colors';

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
        <Stack.Screen name="progress" options={{ title: 'My Progress' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
