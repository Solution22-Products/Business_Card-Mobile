import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getContacts } from '../../services/contact';
import Header from '../../components/Header/index';
import { getCurrentUserProfile } from '../../services/profile';

export default function ContactScreen() {
  const navigation = useNavigation<any>();
  const [cards, setCards] = useState([]);
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
      const [userDesignation, setUserDesignation] = useState('');

      useEffect(()=>{
        fetchUser()
      },[])

    const fetchUser = async () => {
        try {
          const profile = await getCurrentUserProfile();
          setUserName(profile.full_name);
          setUserDesignation(profile.designation);
          setUserAvatar(profile.avatar_url);
        } catch (err) {
          console.warn('Failed to load profile:', err);
        }
      };

  useEffect(() => {
    const fetchContacts = async () => {
      const data = await getContacts();
      setCards(data);
    };
    fetchContacts();
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('contactdetails', { card: item })}
    >
      <Image
        source={{ uri: item.card?.profile_url }}
        style={styles.avatar}
      />
      <View>
        <Text style={styles.name}>{item.full_name}</Text>

        {item.email ? (
          <Text style={styles.subtext}>📧 {item.email}</Text>
        ) : null}

        {item.mobile ? (
          <Text style={styles.subtext}>📞 {item.mobile}</Text>
        ) : null}

        {item.note ? (
          <Text style={styles.subtext} numberOfLines={1}>📝 {item.note}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          avatarUri={
            userAvatar || 'https://your-fallback-avatar.com/fallback.png'
          }
          name={userName || 'Guest'}
          onNotificationsPress={() => {}}
          onAvatarPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </View>
      <Text style={styles.heading}>Contact</Text>
      {cards.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No contacts found
        </Text>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F6FA',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtext: {
    fontSize: 12,
    color: '#777',
  },
});
