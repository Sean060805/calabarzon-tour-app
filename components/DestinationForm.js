import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CATEGORIES from '../constants/categories';
import colors from '../constants/colors';
import PROVINCES from '../constants/provinces';
import { pickAndCompressImage } from '../utils/image';
import { isValidCoordinates } from '../utils/maps';
import AppButton from './AppButton';
import Chip from './Chip';

// Shared by the Add and Edit screens.
// initialValues fills the form (Edit), and onSubmit(data) saves it.
export default function DestinationForm({ initialValues = {}, submitLabel, onSubmit }) {
  const [name, setName] = useState(initialValues.name || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [history, setHistory] = useState(initialValues.history || '');
  const [significance, setSignificance] = useState(initialValues.significance || '');
  const [address, setAddress] = useState(initialValues.address || '');
  const [coordinates, setCoordinates] = useState(initialValues.coordinates || '');
  const [sources, setSources] = useState(initialValues.sources || '');
  const [photoCredit, setPhotoCredit] = useState(initialValues.photoCredit || '');
  const [province, setProvince] = useState(initialValues.province || '');
  const [category, setCategory] = useState(initialValues.category || '');
  const [image, setImage] = useState(initialValues.image || '');
  const [errors, setErrors] = useState({});
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handlePickImage() {
    setProcessingPhoto(true);
    try {
      const pickedImage = await pickAndCompressImage();
      if (pickedImage) {
        setImage(pickedImage);
      }
    } catch (err) {
      Alert.alert('Photo problem', err.message);
    } finally {
      setProcessingPhoto(false);
    }
  }

  function validate() {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Please enter a name.';
    if (!description.trim()) newErrors.description = 'Please enter a description.';
    if (!history.trim()) newErrors.history = 'Please enter the history.';
    if (!significance.trim()) newErrors.significance = 'Please enter the cultural significance.';
    if (!address.trim()) newErrors.address = 'Please enter an address.';
    // Coordinates may be left empty, but if typed they must look like "14.2136, 121.1668"
    if (coordinates.trim() && !isValidCoordinates(coordinates)) {
      newErrors.coordinates = 'Please type two numbers with a comma between them.';
    }
    if (!province) newErrors.province = 'Please choose a province.';
    if (!category) newErrors.category = 'Please choose a category.';
    if (!image) newErrors.image = 'Please pick a photo.';
    return newErrors;
  }

  async function handleSave() {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Alert.alert('Missing information', 'Please fill in all the fields marked in red.');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        history: history.trim(),
        significance: significance.trim(),
        address: address.trim(),
        coordinates: coordinates.trim(),
        sources: sources.trim(),
        photoCredit: photoCredit.trim(),
        province,
        category,
        image,
      });
    } catch (err) {
      console.log(err);
      Alert.alert('Could not save', 'Please check your internet connection and try again.');
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Field label="Name" error={errors.name}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Rizal Shrine"
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={description}
          onChangeText={setDescription}
          placeholder="What is this place known for?"
          multiline
        />
      </Field>

      <Field label="History" error={errors.history}>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={history}
          onChangeText={setHistory}
          placeholder="What happened here, and when?"
          multiline
        />
      </Field>

      <Field label="Cultural Significance" error={errors.significance}>
        <TextInput
          style={[styles.input, styles.multiline]}
          value={significance}
          onChangeText={setSignificance}
          placeholder="Why does this place matter to Filipinos today?"
          multiline
        />
      </Field>

      <Field label="Address" error={errors.address}>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="e.g. F. Mercado St., Calamba, Laguna"
        />
      </Field>

      <Field label="Map coordinates (optional)" error={errors.coordinates}>
        <TextInput
          style={styles.input}
          value={coordinates}
          onChangeText={setCoordinates}
          placeholder="e.g. 14.213677, 121.166827"
          autoCorrect={false}
        />
        <Text style={styles.hint}>
          Used by the "Open 360° Street View" button. In Google Maps, press and hold on the place,
          then copy the two numbers it shows.
        </Text>
      </Field>

      <Field label="Province" error={errors.province}>
        <View style={styles.chips}>
          {PROVINCES.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={province === item}
              onPress={() => setProvince(item)}
            />
          ))}
        </View>
      </Field>

      <Field label="Category" error={errors.category}>
        <View style={styles.chips}>
          {CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </View>
      </Field>

      <Field label="Sources (optional)">
        <TextInput
          style={[styles.input, styles.multiline]}
          value={sources}
          onChangeText={setSources}
          placeholder="Where the facts come from, one source on each line"
          multiline
        />
        <Text style={styles.hint}>Shown on the Sources and Credits screen.</Text>
      </Field>

      <Field label="Photo" error={errors.image}>
        {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}
        {processingPhoto ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <AppButton
            title={image ? 'Change Photo' : 'Pick Photo from Gallery'}
            variant="outline"
            onPress={handlePickImage}
          />
        )}
      </Field>

      <Field label="Photo credit (optional)">
        <TextInput
          style={styles.input}
          value={photoCredit}
          onChangeText={setPhotoCredit}
          placeholder="e.g. Photo: Juan Cruz, CC BY-SA 4.0"
        />
      </Field>

      <View style={styles.saveArea}>
        {saving ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <AppButton title={submitLabel} onPress={handleSave} disabled={processingPhoto} />
        )}
      </View>
    </ScrollView>
  );
}

// One form row: a label on top, the input in the middle, and an error message below
function Field({ label, error, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 48,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textLight,
    marginTop: 6,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 6,
  },
  saveArea: {
    marginTop: 8,
  },
});
