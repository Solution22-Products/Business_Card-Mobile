import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../../services/authservice';
import { showToast } from '../../utils/toast';
import { supabase } from '../../supabase/supabase';
import { getCurrentUserProfile } from '../../services/profile';

export default function CustomDrawerContent(
  props: DrawerContentComponentProps,
) {
  const navigation = useNavigation();

  /* ─────────────── local state ─────────────── */
  const [avatarUri, setAvatarUri] = useState(
    'https://randomuser.me/api/portraits/men/76.jpg', // fallback
  );
  const [fullName, setFullName] = useState('John Copper');

  /* ─────────────── fetch profile once ─────────────── */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 1️⃣ make sure we have an auth session
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // 2️⃣ fetch profile row
        const profile = await getCurrentUserProfile();
        if (mounted) {
          if (profile.avatar_url) setAvatarUri(profile.avatar_url);
          if (profile.full_name) setFullName(profile.full_name);
        }
      } catch (err) {
        console.warn('Drawer profile load error:', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /* ─────────────── UI ─────────────── */
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* User Info Section */}
      <View style={styles.userSection}>
        <Image
          source={{ uri: `${avatarUri}?t=${Date.now()}` }}
          style={styles.avatar}
        />
        <View style={styles.userTextBlock}>
          <Text style={styles.welcome}>Welcome,</Text>
          <Text style={styles.name}>{fullName}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Drawer Items */}
      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>

      {/* Log‑out */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          const result = await logoutUser();
          if (result.success) {
            showToast('info', 'Logged out', 'See you soon!');
            navigation.reset({
              index: 0,
              routes: [
                { name: 'WelcomeScreen', params: { autoOpen: 'signin' } },
              ],
            });
          } else {
            showToast('error', 'Logout failed', result.error);
          }
        }}
      >
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

/* ─────────────── styles ─────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, width: '70%' },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  userTextBlock: { flexDirection: 'column' },
  welcome: { fontSize: 13, color: '#888' },
  name: { fontSize: 16, fontWeight: '700', color: '#0B1E50' },
  divider: { borderBottomWidth: 1, width: 173, borderBottomColor: '#D1D1D1' },
  drawerList: { flex: 1, paddingTop: 10 },
  logoutButton: { padding: 20, borderTopWidth: 1, borderColor: '#eee' },
  logoutText: { color: '#E53935', fontWeight: '600' },
});
