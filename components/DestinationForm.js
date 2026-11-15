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
import AppButton from './AppButton';
import Chip from './Chip';

// Shared by the Add and Edit screens.
// initialValues fills the form (Edit), and onSubmit(data) saves it.
export default function DestinationForm({ initialValues = {}, submitLabel, onSubmit }) {
  const [name, setName] = useState(initialValues.name || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [address, setAddress] = useState(initialValues.address || '');
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
    if (!address.trim()) newErrors.address = 'Please enter an address.';
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
        address: address.trim(),
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

      <Field label="Address" error={errors.address}>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="e.g. F. Mercado St., Calamba, Laguna"
        />
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
  error: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 6,
  },
  saveArea: {
    marginTop: 8,
  },
});
