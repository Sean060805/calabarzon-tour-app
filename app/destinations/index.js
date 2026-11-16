import { useFocusEffect, useLocalSearchParams } from 'expo-router';
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
import { getProgressForStudent } from '../../services/progressService';
import { getStudent } from '../../utils/student';

export default function DestinationListScreen() {
  // The Home screen can open this screen with a province already chosen
  const params = useLocalSearchParams();
  const [destinations, setDestinations] = useState([]);
  // The IDs of the destinations whose quiz this student has passed
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [province, setProvince] = useState(params.province || 'All');

  const loadDestinations = useCallback(async () => {
    try {
      const [data, student] = await Promise.all([getAllDestinations(), getStudent()]);
      setDestinations(data);
      // No student yet means nobody has taken a quiz on this phone
      const progressList = student ? await getProgressForStudent(student.id) : [];
      setCompletedIds(
        progressList.filter((item) => item.completed).map((item) => item.destinationId)
      );
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Could not load destinations. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Runs every time this screen is shown, so new or changed destinations appear
  useFocusEffect(
    useCallback(() => {
      loadDestinations();
    }, [loadDestinations])
  );

  function handleRetry() {
    setLoading(true);
    loadDestinations();
  }

  // Pull the list down to reload it
  async function handleRefresh() {
    setRefreshing(true);
    await loadDestinations();
    setRefreshing(false);
  }

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
    return <StatusView message={error} onRetry={handleRetry} />;
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
        renderItem={({ item }) => (
          <DestinationCard destination={item} completed={completedIds.includes(item.id)} />
        )}
        contentContainerStyle={styles.list}
        keyboardDismissMode="on-drag"
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <Text style={styles.count}>
            Showing {filteredDestinations.length} of {destinations.length}
          </Text>
        }
        ListEmptyComponent={
          <Text style={styles.message}>
            {destinations.length === 0
              ? 'No destinations yet. Tap "+ Add" to create one.'
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
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  list: {
    padding: 16,
    paddingBottom: 40,
  },
  count: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 24,
  },
});
