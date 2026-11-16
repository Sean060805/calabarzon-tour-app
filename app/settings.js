import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import AppButton from '../components/AppButton';
import StatusView from '../components/StatusView';
import colors from '../constants/colors';
import { getAppSettings, saveAppSettings } from '../services/settingsService';
import { pickAndCompressLogo } from '../utils/image';

// Lets the owner of the app change its name, logo, and opening text without touching the code.
// The values are saved in Firebase, so every phone that opens the app shows the new ones.
export default function AppSettingsScreen() {
  const [appName, setAppName] = useState('');
  const [label, setLabel] = useState('');
  const [intro, setIntro] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const settings = await getAppSettings();
      setAppName(settings.appName);
      setLabel(settings.label);
      setIntro(settings.intro);
      setOwnerName(settings.ownerName);
      setLogo(settings.logo);
      setError(null);
    } catch (err) {
      console.log(err);
      setError('Could not load the settings. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function handleRetry() {
    setLoading(true);
    loadSettings();
  }

  async function handlePickLogo() {
    setBusy(true);
    try {
      const picked = await pickAndCompressLogo();
      if (picked) {
        setLogo(picked);
      }
    } catch (err) {
      Alert.alert('Logo problem', err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!appName.trim() || !intro.trim()) {
      Alert.alert('Missing information', 'Please type the app name and the opening text.');
      return;
    }

    setBusy(true);
    try {
      await saveAppSettings({
        appName: appName.trim(),
        label: label.trim(),
        intro: intro.trim(),
        ownerName: ownerName.trim(),
        logo,
      });
      router.back();
    } catch (err) {
      console.log(err);
      Alert.alert('Could not save', 'Please check your internet connection and try again.');
      setBusy(false);
    }
  }

  if (loading) {
    return <StatusView loading />;
  }

  if (error) {
    return <StatusView message={error} onRetry={handleRetry} />;
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={styles.note}>
        Change the name, logo, and opening text of the app here. The Home screen and the Sources
        and Credits screen use them.
      </Text>

      <Text style={styles.label}>Logo</Text>
      {logo ? (
        <Image source={{ uri: logo }} style={styles.logo} />
      ) : (
        <Text style={styles.hint}>No logo yet. The Home screen shows only the name.</Text>
      )}
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <AppButton
            title={logo ? 'Change Logo' : 'Pick Logo from Gallery'}
            variant="outline"
            small
            onPress={handlePickLogo}
            disabled={busy}
          />
        </View>
        {logo ? (
          <View style={styles.rowItem}>
            <AppButton
              title="Remove Logo"
              variant="danger"
              small
              onPress={() => setLogo('')}
              disabled={busy}
            />
          </View>
        ) : null}
      </View>

      <Text style={styles.label}>App name</Text>
      <TextInput
        style={styles.input}
        value={appName}
        onChangeText={setAppName}
        placeholder="e.g. CALABARZON Virtual Tour"
        maxLength={40}
      />

      <Text style={styles.label}>Small text above the name (optional)</Text>
      <TextInput
        style={styles.input}
        value={label}
        onChangeText={setLabel}
        placeholder="e.g. REGION IV-A"
        maxLength={40}
      />

      <Text style={styles.label}>Opening text</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={intro}
        onChangeText={setIntro}
        placeholder="One or two sentences that tell visitors what the app is for"
        multiline
      />

      <Text style={styles.label}>Owner or developer (optional)</Text>
      <TextInput
        style={styles.input}
        value={ownerName}
        onChangeText={setOwnerName}
        placeholder="e.g. a person, a school, or a company"
        maxLength={60}
      />
      <Text style={styles.hint}>Shown on the Sources and Credits screen.</Text>

      <View style={styles.saveArea}>
        {busy ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <AppButton title="Save Settings" onPress={handleSave} />
        )}
      </View>
    </ScrollView>
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
  note: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textLight,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textLight,
    marginTop: 6,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  rowItem: {
    flex: 1,
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
    minHeight: 110,
    textAlignVertical: 'top',
  },
  saveArea: {
    marginTop: 28,
  },
});
