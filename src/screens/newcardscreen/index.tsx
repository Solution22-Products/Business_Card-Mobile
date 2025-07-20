import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import IMAGES from '../../constants';
import AboutStepScreen from '../aboutscreen/index';
import LinkStepScreen from '../linkscreen/index';
import { getCurrentUserProfile } from '../../services/profile';
import LeadCaptureScreen from '../leadcapture';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../supabase/supabase';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;
const STEP_LINE_LENGTH = 40;
const SUCCESS = '#00C851';
const PRIMARY = '#0057FF';
const INACTIVE_GREY = '#BBB';
const UPCOMING_GREY = '#E0E0E0';

const steps = ['Theme', 'About', 'Links', 'Lead Capture', 'Email'];

// ✅ Update to match your CardThemePreview switch-case
const mockThemes = [
  { id: 'theme-hanging-glass', image: IMAGES.Theme },
  { id: 'theme-cover-social', image: IMAGES.Theme1 },
  { id: 'theme-classic-dark', image: IMAGES.Theme2 },
  {id:'theme-static-card',image:IMAGES.Theme6}
];

const ThemeScreen = () => {
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userCardId, setUserCardId] = useState<string | null>(null);
  const navigation = useNavigation();

 const handleThemeSelect = async (theme: string) => {
  setSelectedThemeId(theme); // 🔁 async update

  if (userCardId) {
    const { error } = await supabase
      .from('cards')
      .update({ theme })
      .eq('id', userCardId);

    if (error) {
      console.error('❌ Error updating theme:', error.message);
    } else {
      console.log('✅ Theme updated successfully:', theme);
    }
  }

  // ⏱ Delay advancing to next step to ensure state is applied
  setTimeout(() => {
    setSelectedStepIndex(1);
  }, 100);
};



  const renderStep = (label: string, index: number) => {
    const isActive = selectedStepIndex === index;
    const isCompleted = selectedStepIndex > index;
    const isUpcoming = selectedStepIndex < index;

    let lineStyle = styles.stepLine;
    if (isCompleted) lineStyle = styles.stepLineCompleted;
    else if (isActive) lineStyle = styles.stepLineActive;

    let circleStyle = styles.stepCircle;
    if (isCompleted) circleStyle = styles.completedStepCircle;
    else if (isActive) circleStyle = styles.activeStepCircle;
    else if (isUpcoming) circleStyle = styles.upcomingStepCircle;

    let iconColor = isUpcoming ? '#999' : '#fff';

    return (
      <View key={index} style={styles.stepContainer}>
        {index !== 0 && <View style={lineStyle} />}
        <TouchableOpacity
          style={styles.stepItem}
          onPress={() => setSelectedStepIndex(index)}
        >
          <View style={circleStyle}>
            <Ionicons name="checkmark" size={14} color={iconColor} />
          </View>
          <Text style={[styles.stepLabel, isActive && styles.activeStepLabel]}>
            {label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getCurrentUserProfile();
        setUserName(profile.full_name);
        setUserAvatar(profile.avatar_url);

        const { data: card, error } = await supabase
          .from('cards')
          .select('id, theme')
          .eq('user_id', profile.id)
          .limit(1)
          .single();

        if (error) {
          console.error('❌ Error fetching card:', error.message);
        }

        if (card?.id) {
          setUserCardId(card.id);
          if (card.theme) {
            setSelectedThemeId(card.theme);
          }
        }
      } catch (error) {
        console.log('❌ Failed to load user profile or card:', error);
      }
    };

    fetchUser();
  }, []);

  const renderTheme = ({ item }: { item: { id: string; image: any } }) => {
    const isSelected = selectedThemeId === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.cardWrapper,
          isSelected && { borderColor: '#0057FF', borderWidth: 2 },
        ]}
        onPress={() => handleThemeSelect(item.id)}
      >
        <ImageBackground
          source={item.image}
          style={styles.cardImage}
          imageStyle={{ borderRadius: 16 }}
        >
          <View style={styles.previewButton}>
            <Ionicons name="eye-outline" size={16} color="#fff" />
            <Text style={styles.previewText}>Preview</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const renderCurrentStep = () => {
    switch (selectedStepIndex) {
      case 0:
        return (
          <FlatList
            data={mockThemes}
            keyExtractor={item => item.id}
            numColumns={2}
            renderItem={renderTheme}
            contentContainerStyle={styles.cardList}
            columnWrapperStyle={{
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
            showsVerticalScrollIndicator={false}
          />
        );
      case 1:
        return (
          <AboutStepScreen
            navigation={navigation}
            selectedThemeId={selectedThemeId} // ✅ pass as prop
            onNextStep={() => setSelectedStepIndex(2)} // 👈 advance to Links step
          />
        );
      case 2:
        return <LinkStepScreen goToNextStep={() => setSelectedStepIndex(3)} />;
      case 3:
        return <LeadCaptureScreen />;
      case 4:
        return (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Email Step Content</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header
        avatarUri={
          userAvatar || 'https://your-fallback-avatar.com/fallback.png'
        }
        name={userName || 'Guest'}
        onNotificationsPress={() => {}}
        onAvatarPress={() => {}}
      />
      <View style={styles.stepper}>{steps.map(renderStep)}</View>

      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>{steps[selectedStepIndex]}</Text>
        {selectedStepIndex === 0 && (
          <TouchableOpacity>
            <Text style={styles.filterText}>Filters</Text>
          </TouchableOpacity>
        )}
      </View>

      {renderCurrentStep()}
    </View>
  );
};

export default ThemeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepLine: {
    width: STEP_LINE_LENGTH,
    height: 2,
    backgroundColor: INACTIVE_GREY,
  },
  stepLineCompleted: {
    width: STEP_LINE_LENGTH,
    height: 2,
    backgroundColor: SUCCESS,
  },
  stepLineActive: {
    width: STEP_LINE_LENGTH,
    height: 2,
    backgroundColor: PRIMARY,
  },
  completedStepCircle: {
    backgroundColor: SUCCESS,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  activeStepCircle: {
    backgroundColor: PRIMARY,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  upcomingStepCircle: {
    backgroundColor: UPCOMING_GREY,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  stepItem: {
    alignItems: 'center',
  },

  stepCircle: {
    backgroundColor: INACTIVE_GREY,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepLabel: {
    fontSize: 10,
    color: '#555',
  },
  activeStepLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  filterText: {
    color: '#0057FF',
    fontWeight: '500',
  },
  cardList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardWrapper: {
    width: 170,
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  previewButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  previewText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
  },
  placeholder: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
  },
});

export default ThemeScreen;
