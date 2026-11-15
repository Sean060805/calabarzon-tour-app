import { router } from 'expo-router';
import DestinationForm from '../../components/DestinationForm';
import { addDestination } from '../../services/destinationService';

export default function AddDestinationScreen() {
  async function handleAdd(data) {
    await addDestination(data);
    router.back();
  }

  return <DestinationForm submitLabel="Save Destination" onSubmit={handleAdd} />;
}
