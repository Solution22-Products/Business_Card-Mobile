import IMAGES from '../../constants';
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  title: string;
  subText: string;
  iconType?: 'profile' | 'cover' | 'logo';
  imageUri?: string | null;
  onPick: () => void;
};

const GREY = '#C4C4C4';
const BLUE = '#0E67FD';

const ImageUploadBox: React.FC<Props> = ({
  title,
  subText,
  iconType = 'profile',
  imageUri,
  onPick,
}) => {
  /* ------------- helpers ------------- */
  const renderIcon = () => {
    switch (iconType) {
      case 'cover':
        return (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Ionicons name="image-outline" size={28} color={GREY} />
            <Ionicons name="film-outline" size={28} color={GREY} />
          </View>
        );
      case 'logo':
        return <Ionicons name="business-outline" size={28} color={GREY} />;
      default:
        return <Ionicons name="person-outline" size={40} color={GREY} />;
    }
  };

  const Placeholder = () => (
    <View style={styles.placeholderContent}>
      {renderIcon()}
      <Text style={styles.subText}>
        <Text style={styles.selectText}>Select</Text> {subText}
      </Text>
    </View>
  );

  /* ------------- JSX ------------- */
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{title}</Text>

    <TouchableOpacity
  style={[styles.uploadBox, iconType === 'profile' && styles.profileBox]}
  onPress={onPick}
  activeOpacity={0.8}
>
  {imageUri ? (
    <Image
      source={{ uri: imageUri }}
      style={[
        styles.imagePreview,
        iconType === 'profile' && styles.fullWidthPreview,
      ]}
    />
  ) : (
    <Placeholder />
  )}
</TouchableOpacity>

    </View>
  );
};

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#111',
  },

  uploadBox: {
    height: 200,
    borderWidth: 2,
    borderColor: GREY,
    borderRadius: 16,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  profileBox: {
    height: 200,
  },

  /* preview modes */
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  pickedProfile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    resizeMode: 'cover',
  },

  /* placeholder */
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  subText: {
    color: GREY,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  selectText: { color: BLUE, fontWeight: '600' },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  fullWidthPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
});

export default ImageUploadBox;
