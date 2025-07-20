import React from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';

interface Props {
  name: string;
  designation?: string;
  company?: string;
  avatar: string;
  cover?: string;
}

const GlassCard: React.FC<Props> = ({ name, designation, company, avatar, cover }) => {
  return (
    <View style={styles.cardWrapper}>
      <ImageBackground
        source={{ uri: cover || 'https://your-default-cover.png' }}
        style={styles.card}
        imageStyle={styles.coverImage}
      >
        <View style={styles.darkOverlay} />

        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </View>

        {Platform.OS === 'ios' ? (
          <BlurView style={styles.infoSection} blurType="light" blurAmount={10}>
            <CardContent {...{ name, designation, company }} />
          </BlurView>
        ) : (
          <View style={[styles.infoSection, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <CardContent {...{ name, designation, company }} />
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const CardContent = ({ name, designation, company }: Props) => (
  <>
    <Text style={styles.name}>{name}</Text>
    {designation && <Text style={styles.designation}>{designation}</Text>}
    {company && <Text style={styles.company}>{company}</Text>}
  </>
);

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#000',
  },
  card: {
    height: 250,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  coverImage: {
    resizeMode: 'cover',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  avatarContainer: {
    position: 'absolute',
    top: -32,
    alignSelf: 'center',
    zIndex: 3,
    backgroundColor: '#00000040',
    borderRadius: 36,
    padding: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoSection: {
    marginTop: 40,
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  designation: {
    color: '#eee',
    fontSize: 13,
    marginTop: 2,
  },
  company: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 1,
  },
});

export default GlassCard;
