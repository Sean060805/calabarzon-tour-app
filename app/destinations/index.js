import { router } from 'expo-router';
import { Button, FlatList, StyleSheet, View } from 'react-native';
import DestinationCard from '../../components/DestinationCard';
import colors from '../../constants/colors';
import sampleDestinations from '../../data/sampleDestinations';

export default function DestinationListScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Button title="Add Destination" onPress={() => router.push('/destinations/add')} />
      </View>
      <FlatList
        data={sampleDestinations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DestinationCard destination={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
});
