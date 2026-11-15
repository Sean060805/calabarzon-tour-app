import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import CategoryFilter from '../../components/CategoryFilter';
import DestinationCard from '../../components/DestinationCard';
import SearchBar from '../../components/SearchBar';
import StatusView from '../../components/StatusView';
import CATEGORIES from '../../constants/categories';
import colors from '../../constants/colors';
import PROVINCES from '../../constants/provinces';
import { getAllDestinations } from '../../services/destinationService';

export default function DestinationListScreen() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [province, setProvince] = useState('All');

  // Runs every time this screen is shown, so new or changed destinations appear
  useFocusEffect(
    useCallback(() => {
      async function loadDestinations() {
        try {
          const data = await getAllDestinations();
          setDestinations(data);
          setError(null);
        } catch (err) {
          console.log(err);
          setError('Could not load destinations. Check your internet connection.');
        } finally {
          setLoading(false);
        }
      }
      loadDestinations();
    }, [])
  );

  // Like WHERE name LIKE '%search%' AND category = ? AND province = ?, but done in JavaScript
  const searchText = search.trim().toLowerCase();
  const filteredDestinations = destinations.filter((item) => {
    const matchesName = (item.name || '').toLowerCase().includes(searchText);
    const matchesCategory = category === 'All' || item.category === category;
    const matchesProvince = province === 'All' || item.province === province;
    return matchesName && matchesCategory && matchesProvince;
  });

  if (loading) {
    return <StatusView loading />;
  }

  if (error) {
    return <StatusView message={error} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <SearchBar value={search} onChangeText={setSearch} />
        <CategoryFilter options={CATEGORIES} selected={category} onSelect={setCategory} />
        <CategoryFilter options={PROVINCES} selected={province} onSelect={setProvince} />
      </View>
      <FlatList
        data={filteredDestinations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DestinationCard destination={item} />}
        contentContainerStyle={styles.list}
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <Text style={styles.message}>
            {destinations.length === 0
              ? 'No destinations yet. Tap "Add" to create one.'
              : 'No results. Try a different search or filter.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filters: {
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  message: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 24,
  },
});
