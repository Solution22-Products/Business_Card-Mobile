import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getCurrentUserProfile,
  upsertProfile,
  uploadAvatar,
} from '../../services/profile';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import IMAGES from '../../constants'; // fallback image
import { supabase } from '../../supabase/supabase';
const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  console.log("User Name:",username)

  useEffect(() => {
    (async () => {
      try {
        const profile = await getCurrentUserProfile();

        console.log("PPRofiele",profile)
        setUsername(profile.full_name);
        setEmail(profile.email);
        setAvatarUrl(profile.avatar_url);

        // 👇 Add this for debugging
        const { data, error } = await supabase.storage.from('avatars').list();
        console.log('🧾 Bucket files:', data);
        if (error) console.error('❌ Error listing files:', error);
      } catch (e) {
        Alert.alert('Error', e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'We need your permission to use the camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const pickImage = async (type: 'camera' | 'gallery') => {
    const options = { mediaType: 'photo', quality: 0.7 };

    if (type === 'camera') {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Camera access is required');
        return;
      }
    }

    const result =
      type === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    try {
      setLoading(true);
      const publicUrl = await uploadAvatar(
        asset.uri,
        asset.type ?? 'image/jpeg',
        asset.fileName ?? 'avatar.jpg',
      );
      await upsertProfile({ avatar_url: publicUrl });
      setAvatarUrl(publicUrl);
    } catch (e) {
      Alert.alert('Upload failed', e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  const openImagePicker = () => {
    Alert.alert('Change Profile Photo', '', [
      { text: 'Camera', onPress: () => pickImage('camera') },
      { text: 'Gallery', onPress: () => pickImage('gallery') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

 const handleSave = async () => {
  try {
    setLoading(true);

    // 🔁 Save the new name (and avatar if changed)
    await upsertProfile({ full_name: username, avatar_url: avatarUrl });

    // 🔄 Refetch updated profile from Supabase
    const updatedProfile = await getCurrentUserProfile();

    // console.log("OOOOOOOOOOOOOOOOOOO",avatarUrl)

    // 🆕 Set state with fresh data from DB
    setUsername(updatedProfile.full_name);
    setEmail(updatedProfile.email);
    setAvatarUrl(updatedProfile.avatar_url);

    Alert.alert('Success', 'Profile updated successfully');
  } catch (e) {
    Alert.alert('Error', e.message ?? String(e));
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0057FF" />
      </View>
    );
  }
  let avatarSource;

  if (avatarUrl && avatarUrl.startsWith('http')) {
    console.log('Using avatar from:', avatarUrl);
    avatarSource = { uri: `${avatarUrl}?t=${Date.now()}` };
  } else {
    console.log('Using fallback avatar image');
    avatarSource = IMAGES.Contact;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backRow}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.title}>Profile Settings</Text>

        <View style={styles.profileImageWrapper}>
          <Image source={avatarSource} style={styles.profileImage} />

          <TouchableOpacity onPress={openImagePicker} style={styles.editIcon}>
            <Ionicons name="create-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>User Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value="********"
          editable={false}
        />

        <TouchableOpacity onPress={handleSave} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleCard}>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Push Notification</Text>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Email Notification</Text>
          <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

// Styles
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9f9f9', flexGrow: 1 },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backText: { fontSize: 16, marginLeft: 6, color: '#000' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  profileImageWrapper: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ccc',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 6,
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  disabledInput: { color: '#999' },
  resetButton: {
    backgroundColor: '#0057FF',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  resetButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  toggleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleLabel: { fontSize: 16, color: '#000' },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
