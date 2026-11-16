import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import colors from '../constants/colors';
import { pickAndCompress360Image, pickAndCompressImage } from '../utils/image';
import AppButton from './AppButton';
import Chip from './Chip';

// The form for adding one photo to a tour. onSubmit(data) saves it.
export default function TourStopForm({ onSubmit }) {
  const [kind, setKind] = useState('photo');
  const [image, setImage] = useState('');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('');
  const [busy, setBusy] = useState(false);

  function handleChangeKind(newKind) {
    setKind(newKind);
    // A photo picked as "normal" was shrunk too much to be used as a 360° photo, so pick again
    setImage('');
  }

  async function handlePickImage() {
    setBusy(true);
    try {
      const picked = kind === '360' ? await pickAndCompress360Image() : await pickAndCompressImage();
      if (picked) {
        setImage(picked);
      }
    } catch (err) {
      Alert.alert('Photo problem', err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleAdd() {
    if (!image || !caption.trim()) {
      Alert.alert('Missing information', 'Please pick a photo and type a caption.');
      return;
    }

    setBusy(true);
    try {
      await onSubmit({ kind, image, caption: caption.trim(), credit: credit.trim() });
      // Empty the form, ready for the next photo
      setImage('');
      setCaption('');
      setCredit('');
    } catch (err) {
      console.log(err);
      Alert.alert('Could not save', 'Please check your internet connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View>
      <Text style={styles.label}>Kind of photo</Text>
      <View style={styles.chips}>
        <Chip label="Normal photo" selected={kind === 'photo'} onPress={() => handleChangeKind('photo')} />
        <Chip label="360° photo" selected={kind === '360'} onPress={() => handleChangeKind('360')} />
      </View>
      {kind === '360' ? (
        <Text style={styles.note}>
          A 360° photo is twice as wide as it is tall. You can take one with a 360° camera, or
          with a phone camera's "Photo Sphere" or "360" mode.
        </Text>
      ) : null}

      {image ? <Image source={{ uri: image }} style={styles.preview} /> : null}
      <AppButton
        title={image ? 'Change Photo' : 'Pick Photo from Gallery'}
        variant="outline"
        onPress={handlePickImage}
        disabled={busy}
      />

      <Text style={styles.label}>Caption</Text>
      <TextInput
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        placeholder="e.g. The balcony facing the street"
      />

      <Text style={styles.label}>Photo credit (optional)</Text>
      <TextInput
        style={styles.input}
        value={credit}
        onChangeText={setCredit}
        placeholder="e.g. Photo: Juan Cruz"
      />

      <View style={styles.saveArea}>
        {busy ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <AppButton title="Add to Tour" onPress={handleAdd} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textLight,
    marginBottom: 12,
  },
  preview: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
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
  saveArea: {
    marginTop: 20,
  },
});
