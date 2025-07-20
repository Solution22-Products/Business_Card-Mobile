import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import IMAGES from '../../constants';
import { getCurrentUserProfile } from '../../services/profile';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { getUserCards } from '../../services/newcard';
import CardThemePreview from '../../components/CardTheme';

interface CardItem {
  id: string;
  name: string;
  designation?: string;
  company?: string;
  email?: string;
  type: string;
  avatar: string | null;
  is_private?: boolean;
  cover?: string | null;
  theme?: string;
  mobile?: string; // ✅ Add this
  website?: string; // ✅ Add this
}

const CARD_WIDTH = (Dimensions.get('window').width - 16 * 2 - 16) / 2;

const MyCardsScreen: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fallback, setFallback] = useState(false);

  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  console.log('Cards', cards);

  const navigation = useNavigation();
  const route = useRoute();

  const loadCards = async () => {
    try {
      const cardData = await getUserCards();
      console.log('📦 Raw card data:', cardData); // ← add this
      const mapped = cardData.map((card: any) => {
        console.log('🎨 Card theme:', card.theme);

        return {
          id: card.id,
          name: card.full_name || 'My Card',
          designation: card.designation,
          company: card.company,
          email: card.email,
          type: card.card_type,
          avatar: card.profile_url || null,
          is_private: !card.has_business_card,
          theme: [
            'theme-hanging-glass',
            'theme-cover-social',
            'theme-classic-dark',
          ].includes(card.theme)
            ? card.theme
            : 'theme-hanging-glass',
          cover:
            card.cover_url && card.cover_url.startsWith('http')
              ? card.cover_url
              : null,

          mobile: card.mobile || '',
          website: card.website || '',
        };
      });

      setCards(mapped);
    } catch (error) {
      console.error('Error loading cards:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCards();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const profile = await getCurrentUserProfile();
          setUserName(profile.full_name);
          setUserAvatar(profile.avatar_url);
          await loadCards();
        } catch (error) {
          console.error('Error loading profile or cards:', error);
        }
      };

      fetchData();
    }, [route.params?.refresh]),
  );

  console.log('MMMMMMMMMMMYYYYYYYYYYYYYYYY', cards);

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

      <TouchableOpacity
        style={styles.addCardBox}
        onPress={() => navigation.navigate('newcardscreen')}
      >
        <Ionicons name="add-circle-outline" size={24} color="#0057FF" />
        <Text style={styles.addText}>Add New Cards</Text>
      </TouchableOpacity>

      <FlatList
        data={cards}
        numColumns={2} // ✅ this gives 2-column grid
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 16,
        }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          // paddingBottom: 32,
          // paddingTop: 16,
        }}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            // onPress={() =>
            //   navigation.navigate('editcard', { card: item })
            // }
            onPress={() => {
              setSelectedCard(item);
              setShowOptionsModal(true);
            }}
            style={{ }}
          >
            <CardThemePreview
              name={item.name}
              designation={item.designation}
              company={item.company}
              avatar={item.avatar}
              cover={item.cover}
              theme={item.theme}
              email={item.email}
              mobile={item.mobile}
              website={item.website}
              // style={{ width: CARD_WIDTH }}
            />
          </TouchableOpacity>
        )}
      />
      {showOptionsModal && selectedCard && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Options</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowOptionsModal(false);
                navigation.navigate('editcard', { card: selectedCard });
              }}
            >
              <Text style={styles.modalButtonText}>Edit Info & Bio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowOptionsModal(false);
                navigation.navigate('linkscreen', { card: selectedCard });
              }}
            >
              <Text style={styles.modalButtonText}>
                Edit Social Media Links
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowOptionsModal(false);
                navigation.navigate('newcardscreen', { card: selectedCard });
              }}
            >
              <Text style={styles.modalButtonText}>Edit Design</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#eee' }]}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: '#444' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default MyCardsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#0057FF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },

  tagBox: {
    borderRadius: 28,
    width: 96.5,
    paddingVertical: 4,
    alignItems: 'center',
    backgroundColor: '#FFFFFF59',
  },
  addCardBox: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#0057FF',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
  },
  addText: {
    color: '#0057FF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  cardList: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  cardImageBackground: {
    width: CARD_WIDTH,
    height: 315,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    marginRight: 16,
    justifyContent: 'flex-end',
  },
  newCardHighlight: {
    borderWidth: 2,
    borderColor: '#0057FF',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardContent: {
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
    alignSelf: 'center',
  },
  cardSub: {
    fontSize: 12,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 2,
  },
  cardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 4,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'lime',
    marginRight: 6,
  },
  cardTagText: {
    fontSize: 10,
    color: '#E7E7E7',
    fontWeight: '400',
  },
  lockIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    padding: 4,
  },
});
