import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Header from '../../components/Header';
import { getCurrentUserProfile, uploadAvatar } from '../../services/profile';
import ImageUploadBox from '../../components/ImageuploadBox';
import AddInfoAndBioScreen from '../addinfo';
// import LinksScreen from '../links'; // Uncomment when Links screen is ready

const { width } = Dimensions.get('window');
const CARD_RADIUS = 20;
const BLUE = '#0066FF';
const GREY = '#C4C4C4';

interface AboutStepScreenProps {
  selectedThemeId: string | null;
  onNextStep: () => void; // This now becomes "go to Links"
}

export default function AboutStepScreen({
  selectedThemeId,
  onNextStep,
}: AboutStepScreenProps) {
  const [businessCardEnabled, setBusinessCardEnabled] = useState(true);
  const [profileUri, setProfileUri] = useState<string | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);
  const [companyLogoUri, setCompanyLogoUri] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(''); // for Header
  const [username, setUsername] = useState(''); // for Header

  const [cardDraftData, setCardDraftData] = useState<any>(null);
  const [currentSubStep, setCurrentSubStep] = useState<'upload' | 'addinfo' | 'links'>('upload');

  const goToNextStep = () => {
    if (currentSubStep === 'upload') {
      setCurrentSubStep('addinfo');
    } else if (currentSubStep === 'addinfo') {
      setCurrentSubStep('links'); // optional, use this or navigation
      onNextStep(); // call parent to go to full next screen
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const profile = await getCurrentUserProfile();
        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
        if (profile?.full_name) setUsername(profile.full_name);
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    })();
  }, []);

  const pickImage = async (cb: (uri: string) => void) => {
    const res = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (!res.didCancel && res.assets?.length) {
      cb(res.assets[0].uri);
    }
  };

  const handleNext = async () => {
    try {
      const profileUpload = profileUri ? await uploadAvatar(profileUri) : null;
      const coverUpload = coverUri ? await uploadAvatar(coverUri) : null;
      const logoUpload = companyLogoUri ? await uploadAvatar(companyLogoUri) : null;

      const cardDraft = {
        card_type: businessCardEnabled ? 'business' : 'personal',
        profile_url: profileUpload ?? null,
        cover_url: coverUpload ?? null,
        company_logo_url: logoUpload ?? null,
        has_business_card: businessCardEnabled,
      };

      setCardDraftData(cardDraft);
      setCurrentSubStep('addinfo');
    } catch (err: any) {
      console.error('Image upload error:', err);
      Alert.alert('Error', err.message ?? 'Failed to upload images.');
    }
  };

  return (
    <View style={styles.container}>
      <Header avatarUri={avatarUrl || undefined} name={username || 'User'} />

      {currentSubStep === 'upload' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Add Picture</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Business Card</Text>
              <Switch
                value={businessCardEnabled}
                onValueChange={setBusinessCardEnabled}
                trackColor={{ false: GREY, true: BLUE }}
                thumbColor="#fff"
              />
            </View>

            <ImageUploadBox
              title="Profile Picture"
              subText="image file or drag and drop one here"
              iconType="profile"
              imageUri={profileUri}
              onPick={() => pickImage(setProfileUri)}
            />

            <ImageUploadBox
              title="Cover Picture"
              subText="image, video, gif file or drag and drop one here"
              iconType="cover"
              imageUri={coverUri}
              onPick={() => pickImage(setCoverUri)}
            />

            {businessCardEnabled && (
              <ImageUploadBox
                title="Company Logo"
                subText="company logo here"
                iconType="logo"
                imageUri={companyLogoUri}
                onPick={() => pickImage(setCompanyLogoUri)}
              />
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.nextButton} onPress={handleNext}>
              Next
            </Text>
          </View>
        </ScrollView>
      )}

      {currentSubStep === 'addinfo' && cardDraftData && (
        <AddInfoAndBioScreen
          draftCardData={cardDraftData}
          selectedThemeId={selectedThemeId}
          onNextStep={goToNextStep} // 👈 Moves to "links"
        />
      )}

      {/* You can add this later when Links screen is ready */}
      {/* {currentSubStep === 'links' && <LinksScreen cardId={...} />} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    margin: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: CARD_RADIUS,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
  },
  cardHeading: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowLabel: { fontSize: 14, color: '#333' },
  footer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#0E67FD',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 49,
    overflow: 'hidden',
    fontWeight: '600',
    fontSize: 16,
    width: 320,
    textAlign: 'center',
  },
});
