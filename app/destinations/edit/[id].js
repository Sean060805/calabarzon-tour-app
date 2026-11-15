import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import DestinationForm from '../../../components/DestinationForm';
import StatusView from '../../../components/StatusView';
import { getDestinationById, updateDestination } from '../../../services/destinationService';

export default function EditDestinationScreen() {
  const { id } = useLocalSearchParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDestination() {
      try {
        const data = await getDestinationById(id);
        setDestination(data);
      } catch (err) {
        console.log(err);
        setError('Could not load this destination. Check your internet connection.');
      } finally {
        setLoading(false);
      }
    }
    loadDestination();
  }, [id]);

  async function handleUpdate(data) {
    await updateDestination(id, data);
    router.back();
  }

  if (loading) {
    return <StatusView loading />;
  }

  if (error || !destination) {
    return <StatusView message={error || 'Destination not found.'} />;
  }

  return (
    <DestinationForm initialValues={destination} submitLabel="Save Changes" onSubmit={handleUpdate} />
  );
}
