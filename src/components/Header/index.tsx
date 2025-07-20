import React from 'react';
import { View, Image, Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors';

interface HeaderProps {
  avatarUri: string;
  name: string;
  onNotificationsPress?: () => void;
  onAvatarPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  avatarUri,
  name,
  onNotificationsPress,
  onAvatarPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Pressable onPress={onAvatarPress}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </Pressable>
        <View>
          <Text style={styles.welcome}>Welcome,</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      <Pressable onPress={onNotificationsPress} style={styles.bellWrapper}>
        <View
          style={{
            height:35,
            width: 1,
            backgroundColor: '#E7E7E7',
            marginBottom: 4,
            marginRight:30
          }}
        />
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.primary}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  welcome: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  bellWrapper: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Header;
