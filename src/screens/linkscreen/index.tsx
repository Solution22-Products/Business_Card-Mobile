import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors';
import IMAGES from '../../constants';
import { getCurrentUserProfile, updateProfile } from '../../services/profile';
import { useNavigation, useRoute } from '@react-navigation/native';

const platforms = [
  {
    id: '1',
    name: 'Instagram',
    field: 'instagram_username',
    icon: IMAGES.Instagram,
  },
  {
    id: '2',
    name: 'Facebook',
    field: 'facebook_username',
    icon: IMAGES.Facebook,
  },
  { id: '3', name: 'TikTok', field: 'tiktok_username', icon: IMAGES.Tiktok },
  {
    id: '4',
    name: 'LinkedIn',
    field: 'linkedin_username',
    icon: IMAGES.Linkedin,
  },
  {
    id: '5',
    name: 'WhatsApp',
    field: 'whatsapp_number',
    icon: IMAGES.Whatsapp,
  },
  { id: '6', name: 'YouTube', field: 'youtube_username', icon: IMAGES.Youtube },
  {
    id: '7',
    name: 'Snapchat',
    field: 'snapchat_username',
    icon: IMAGES.Snapchat,
  },
  { id: '8', name: 'Threads', field: 'threads_username', icon: IMAGES.Threads },
  { id: '9', name: 'X', field: 'twitter_username', icon: IMAGES.Twitter },
  { id: '10', name: 'Twitch', field: 'twitch_username', icon: IMAGES.TWI },
  {
    id: '11',
    name: 'Telegram',
    field: 'telegram_username',
    icon: IMAGES.Telegram,
  },
  { id: '12', name: 'Clubhouse', field: 'clubhouse_username', icon: IMAGES.Ch },
];
interface LinkStepScreenProps {
  goToNextStep?: () => void;
  cardData?: any;
  setCardData?: (data: any) => void;
}


const LinkStepScreen: React.FC<LinkStepScreenProps> = ({ goToNextStep , 
  cardData,
  setCardData,}) => {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation();

console.log('Loaded data:', finalCardData.full_name, finalCardData.email, finalCardData.theme);

const route = useRoute();
const fallbackCardData = route?.params?.cardData;
const finalCardData = cardData || fallbackCardData || {};
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getCurrentUserProfile();
        const loaded = Object.fromEntries(
          platforms.map(p => [p.field, profile?.[p.field] || '']),
        );
        setUsernames(loaded);
      } catch {
        Alert.alert('Error', 'Failed to load profile data');
      }
    };
    loadProfile();
  }, []);

  const toggleSelectAll = () => {
    setSelectedIds(prev =>
      prev.length === platforms.length ? [] : platforms.map(p => p.id),
    );
  };

 const generateFullUrl = (platform: string, value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  switch (platform) {
    case 'instagram_username':
      return `https://instagram.com/${trimmed}`;
    case 'facebook_username':
      return `https://facebook.com/${trimmed}`;
    case 'tiktok_username':
      return `https://tiktok.com/@${trimmed}`;
    case 'linkedin_username':
      return `https://linkedin.com/in/${trimmed}`;
    case 'whatsapp_number':
      return `https://wa.me/${trimmed}`;
    case 'youtube_username':
      return `https://youtube.com/@${trimmed}`;
    case 'snapchat_username':
      return `https://snapchat.com/add/${trimmed}`;
    case 'threads_username':
      return `https://www.threads.net/@${trimmed}`;
    case 'twitter_username':
      return `https://x.com/${trimmed}`;
    case 'twitch_username':
      return `https://twitch.tv/${trimmed}`;
    case 'telegram_username':
      return `https://t.me/${trimmed}`;
    case 'clubhouse_username':
      return `https://www.clubhouse.com/@${trimmed}`;
    default:
      return trimmed;
  }
};

const handleSave = async () => {
  try {
    const updates = Object.fromEntries(
      platforms.map(p => [
        p.field,
        generateFullUrl(p.field, usernames[p.field] || ''),
      ])
    );

    console.log('🔁 Saving to DB:', updates);
    await updateProfile(updates);
    goToNextStep?.(); // ← add safe call in case it's undefined
  } catch (err) {
    console.log('❌ Save error:', err);
    Alert.alert('Error', err.message ?? 'Failed to save social links');
  }
};

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.fieldLabel}>Add Field</Text>
            <TouchableOpacity
              onPress={toggleSelectAll}
              style={styles.selectAllRow}
            >
              <Ionicons
                name={
                  selectedIds.length === platforms.length
                    ? 'checkbox'
                    : 'square-outline'
                }
                size={20}
                color={colors.primary}
              />
              <Text style={styles.selectAllText}>Select All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#3D3D3D" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="#3D3D3D"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View style={styles.iconGrid}>
            {platforms
              .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
              .map(item => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.iconWrapper,
                      isSelected && styles.iconWrapperSelected,
                    ]}
                    onPress={() =>
                      setSelectedIds(prev =>
                        prev.includes(item.id)
                          ? prev.filter(id => id !== item.id)
                          : [...prev, item.id],
                      )
                    }
                  >
                    <Image
                      source={item.icon}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })}
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.previewButton}>
            <Ionicons name="save-outline" size={16} color="#fff" />
            <Text style={styles.previewText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activeSection}>
          <Text style={styles.linksTitle}>Links</Text>
          {platforms
            .filter(p => selectedIds.includes(p.id))
            .map(platform => (
              <View key={platform.field} style={styles.linkItem}>
                <Text style={styles.platformName}>{platform.name}</Text>
                <TextInput
                  placeholder={`Paste ${platform.name} link`}
                  style={styles.inputField}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={usernames[platform.field] || ''}
                  onChangeText={text =>
                    setUsernames(prev => ({ ...prev, [platform.field]: text }))
                  }
                />

                {/* {usernames[platform.field]?.trim() !== '' && (
                  <Text style={styles.generatedLink}>
                    {generateSocialUrl(
                      platform.name,
                      usernames[platform.field],
                    )}
                  </Text>
                )} */}
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#FAFAFA', flex: 1 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fieldLabel: { fontSize: 18, fontWeight: '600', color: '#040404' },
  selectAllRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  selectAllText: { color: '#040404', fontWeight: '500', marginLeft: 4 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderRadius: 69,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  searchInput: { marginLeft: 8, fontSize: 14, flex: 1, fontWeight: '500' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, padding: 8 },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
  },
  iconWrapperSelected: { backgroundColor: '#00C851' },
  iconImage: { width: 30, height: 30 },
  previewButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    alignSelf: 'center',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 12,
  },
  previewText: { color: '#fff', fontSize: 14, marginLeft: 6 },
  activeSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  linksTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  linkItem: { marginBottom: 20 },
  platformName: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  inputField: {
    backgroundColor: '#F1F1F1',
    borderRadius: 69,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  generatedLink: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
});

export default LinkStepScreen;
