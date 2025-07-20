import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import IMAGES from '../../constants';
import Header from '../../components/Header';
import ProfileCard from '../../components/ProfileCard';
import ProgressCircle from '../../components/ProgressCircle';
import TabSwitch from '../../components/Tabs';
import { colors } from '../../utils/colors';
import StatCard from '../../components/StatCard';
import SubscriptionCard from '../../components/SubscriptionCard';
import ActivityItem from '../../components/Activity';
import PrimaryButton from '../../components/button/primarybutton';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { supabase } from '../../supabase/supabase';
import { getCurrentUserProfile } from '../../services/profile';
import { getUserCards } from '../../services/newcard';
import { getRecentActivity } from '../../services/activity';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import CardThemePreview from '../../components/CardTheme/index';
import DateTimePicker from '@react-native-community/datetimepicker';
import Clipboard from '@react-native-clipboard/clipboard';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

type RootDrawerParamList = {
  Dashboard: undefined;
  Other: undefined;
};

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const [selectedTab, setSelectedTab] = useState(0);
  const [cards, setCards] = useState([]);
  const [activity, setActivity] = useState([]);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userDesignation, setUserDesignation] = useState('');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  const handleCardPress = (card: any) => {
    setSelectedCard(card);
    setIsSharing(false);
    setModalVisible(true);
  };

  const filteredCards = selectedDate
    ? cards.filter(card => {
        if (!card.created_at) return false;
        const cardDate = new Date(card.created_at);
        return (
          cardDate.getFullYear() === selectedDate.getFullYear() &&
          cardDate.getMonth() === selectedDate.getMonth() &&
          cardDate.getDate() === selectedDate.getDate()
        );
      })
    : cards;

  const filteredActivity = selectedDate
    ? activity.filter(act => {
        if (!act.created_at) return false;
        const actDate = new Date(act.created_at);
        return (
          actDate.getFullYear() === selectedDate.getFullYear() &&
          actDate.getMonth() === selectedDate.getMonth() &&
          actDate.getDate() === selectedDate.getDate()
        );
      })
    : activity;

  useEffect(() => {
    async function initNFC() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
      } else {
        Alert.alert('NFC Not Supported', 'This device does not support NFC.');
      }
    }

    initNFC();
    fetchUser();
    fetchUserCards();
    fetchActivity();
  }, []);

  const fetchUser = async () => {
    try {
      setLoadingProfile(true);
      const profile = await getCurrentUserProfile();
      setUserName(profile.full_name);
      setUserDesignation(profile.designation);
      setUserAvatar(profile.avatar_url);
    } catch (err) {
      console.warn('Failed to load profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchUserCards = async () => {
    try {
      setLoadingCards(true);
      const userCards = await getUserCards();
      setCards(userCards);
    } catch (err) {
      console.warn('❌ Failed to load user cards:', err);
    } finally {
      setLoadingCards(false);
    }
  };

  const fetchActivity = async () => {
    try {
      setLoadingActivity(true);
      const recent = await getRecentActivity();
      setActivity(recent);
    } catch (err) {
      console.warn('❌ Failed to load activity:', err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleShareViaNFC = async (card: any) => {
    if (!card) return;

    setIsSharing(true);
    const cardLink = `http://localhost:3000/card/${card.share_id}`;
    const bytes = Ndef.encodeMessage([Ndef.uriRecord(cardLink)]);

    try {
      await NfcManager.cancelTechnologyRequest().catch(() => {});
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to share card via NFC',
      });

      await NfcManager.writeNdefMessage(bytes!);

      Alert.alert('✅ Shared via NFC', `Sent: ${cardLink}`);
    } catch (e: any) {
      console.warn(e);
      Alert.alert('❌ NFC Error', e?.message || 'Something went wrong.');
    } finally {
      setIsSharing(false);
      await NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />

      <View style={styles.headerContainer}>
        {loadingProfile ? (
          <SkeletonPlaceholder>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24 }} />
              <View style={{ marginLeft: 12 }}>
                <View style={{ width: 120, height: 16, borderRadius: 4 }} />
                <View style={{ width: 80, height: 14, borderRadius: 4, marginTop: 6 }} />
              </View>
            </View>
          </SkeletonPlaceholder>
        ) : (
          <Header
            avatarUri={userAvatar}
            name={userName || 'Guest'}
            onNotificationsPress={() => {}}
            onAvatarPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
        )}
      </View>

      <View style={styles.profileSection}>
        {loadingCards ? (
          <SkeletonPlaceholder>
            <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingTop: 12 }}>
              {[1, 2, 3].map(i => (
                <View key={i} style={{ width: 160, height: 200, borderRadius: 16, marginRight: 16 }} />
              ))}
            </View>
          </SkeletonPlaceholder>
        ) : (
          <FlatList
            data={filteredCards}
            horizontal
            keyExtractor={item => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleCardPress(item)}
                style={{ marginRight: 16 }}
                activeOpacity={0.8}
              >
                <CardThemePreview
                  name={item.full_name || userName || '—'}
                  designation={item.card_type || userDesignation || '—'}
                  avatar={item.profile_url || IMAGES.FALLBACK_AVATAR}
                  cover={item.cover_url}
                  theme={item.theme || 'theme-classic-dark'}
                  mobile={item.mobile}
                  website={item.website}
                  address={item.address}
                  linkedin={item.linkedin}
                  instagram={item.instagram}
                  twitter={item.twitter}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ color: '#fff', textAlign: 'center', marginTop: 16 }}>
                No cards found for selected date.
              </Text>
            }
          />
        )}
      </View>

      <View style={styles.whiteCard}>
        <View style={styles.completionBox}>
          <ProgressCircle progress={80} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.completionTitle}>Complete Your Profile</Text>
            <Text style={styles.completionSubtitle}>
              Complete your profile now to unlock features and connect with others.
            </Text>
          </View>
        </View>

        <View style={{ paddingTop: 20 }}>
          <TabSwitch
            tabs={['Personal Card', 'Business Card', 'Café Card']}
            selectedIndex={selectedTab}
            onChange={setSelectedTab}
          />
        </View>

        <View style={styles.insightsCard}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={{ flexDirection: 'row', marginTop: 16 }}>
            <StatCard source={IMAGES.Leads} value={53} label="Leads" deltaPositive />
            <StatCard source={IMAGES.ContactUpload} value={8} label="Contact" deltaPositive={false} />
          </View>
        </View>

        <SubscriptionCard
          plan="Annual Subscription"
          endDate="24 Dec"
          progress={70}
          onRenewPress={() => console.log('Renew clicked')}
        />

        <View style={{ marginTop: 24 }}>
          <View style={styles.recentHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <PrimaryButton
              width={100}
              height={50}
              textStyle={{ color: '#FFFFFF' }}
              title="Filter"
              bgColor="#0E67FD"
              radius={30}
              onPress={() => setShowDatePicker(true)}
            />
            {selectedDate && (
              <TouchableOpacity onPress={() => setSelectedDate(null)}>
                <Text style={{ color: '#0E67FD', fontSize: 14, marginTop: 8 }}>Clear Filter</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.activityCard}>
            {filteredActivity.map((item, idx) => (
              <ActivityItem
                key={idx}
                cardType={item.card_type}
                date={new Date(item.created_at).toLocaleDateString()}
                time={new Date(item.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                name={item.full_name}
              />
            ))}
          </View>
        </View>
      </View>

      <Modal animationType="slide" transparent visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share via NFC or Copy Link</Text>
            {selectedCard && (
              <>
                <Text style={styles.modalSubtitle}>
                  Share this card using NFC or copy the link below.
                </Text>
                <View style={styles.linkBox}>
                  <Text
                    style={styles.linkText}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {`http://localhost:3000/card/${selectedCard.share_id}`}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Clipboard.setString(`http://localhost:3000/card/${selectedCard.share_id}`);
                      Alert.alert('✅ Copied!', 'Link copied to clipboard.');
                    }}
                    style={styles.copyButton}
                  >
                    <Text style={{ color: '#0E67FD', fontWeight: 'bold' }}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <View style={styles.modalButtons}>
              <PrimaryButton title="Cancel" bgColor="#CCCCCC" onPress={() => setModalVisible(false)} width={120} radius={20} />
              <PrimaryButton
                title="Share"
                loading={isSharing}
                disabled={isSharing}
                bgColor="#0E67FD"
                onPress={() => {
                  setModalVisible(false);
                  setTimeout(() => handleShareViaNFC(selectedCard), 500);
                }}
                width={120}
                radius={20}
              />
            </View>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (date) setSelectedDate(date);
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1E50',
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  linkText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    marginRight: 10,
  },
  copyButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  insightsCard: {
    backgroundColor: '#fff',
    marginTop: 30,
    paddingTop: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    height: 200,
    borderRadius: 20,
  },
  headerContainer: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  profileSection: {
    paddingVertical: 16,
    paddingBottom: 40,
    flex: 1,
  },
  whiteCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
    marginTop: -30,
    zIndex: 10,
  },
  completionBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  completionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 16,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#F1F1F1',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
});

export default DashboardScreen;
