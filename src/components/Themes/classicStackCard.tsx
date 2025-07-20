import React ,{useState}from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView, // 1. Import ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// Assuming IMAGES is correctly configured
// import IMAGES from '../../constants';

// --- Data (assuming it's passed as props or defined elsewhere) ---
const cardData = {
  name: 'Steven Smith',
  designation: 'Designation',
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris eu aliquam velit. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
  whatsAppNumber: '911234567890',
  socialLinks: [
    { type: 'facebook', value: 'solution22@facebook.com', icon: 'facebook' },
    { type: 'instagram', value: 'solution22@instagram.com', icon: 'instagram' },
    { type: 'twitter', value: 'solution22@twitter.com', icon: 'twitter' },
    { type: 'youtube', value: 'solution22@youtube.com', icon: 'youtube' },
    { type: 'tiktok', value: 'solution22@tiktok.com', icon: 'tiktok' },
    { type: 'linkedin', value: 'solution22@linkedin.com', icon: 'linkedin' },
  ],
};

const SocialLink = ({ icon, value }) => (
  <TouchableOpacity style={styles.socialRow}>
    <Icon name={icon} size={14} color="#333" />
    <Text style={styles.socialText}>{value}</Text>
  </TouchableOpacity>
);

const DigitalBusinessCard = () => {
  const {
    name,
    designation,
    avatar,
    description,
    whatsAppNumber,
    socialLinks,
  } = cardData;
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleWhatsAppPress = () => {
    Linking.openURL(`https://wa.me/${whatsAppNumber}`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(134, 131, 152, 1)', 'rgba(255, 255, 255, 1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
         onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setHeaderHeight(height);
        }}
      >
        <Text style={styles.designation}>{designation}</Text>
        <Text style={styles.name}>{name}</Text>
      </LinearGradient>

      {/* --- Body Section (White) --- */}
      <View style={styles.body}>
        {/* 2. Wrap the scrollable content in a ScrollView */}
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.saveContactButton}>
            <Text style={styles.saveContactText}>Save Contact</Text>
            <MaterialCommunityIcons name="bookmark" size={11} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.whatsAppButton}
            onPress={handleWhatsAppPress}
          >
            <Text style={styles.whatsAppButtonText}>Chat on </Text>
            <Icon name="whatsapp" size={14} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.description, {}]} numberOfLines={3}>
            {description}
          </Text>

          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(0, 0, 0, 0.15)',
              width: 170,
            }}
          />
          <Image
            source={{
              uri: 'https://via.placeholder.com/150/FFFFFF/000000?Text=Logo',
            }}
            style={styles.logo}
          />

          <View style={styles.socialLinksContainer}>
            {socialLinks.map(link => (
              <SocialLink key={link.type} icon={link.icon} value={link.value} />
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.footerIcon}>
              <Icon name="phone-alt" size={10} color="rgba(255, 255, 255, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerIcon}>
              <Icon name="paper-plane" size={10} color="rgba(255, 255, 255, 1)" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerIcon}>
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={14}
                color="rgba(255, 255, 255, 1)"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerIcon}>
              <Icon name="map-marker-alt" size={10} color="rgba(255, 255, 255, 1)" />
            </TouchableOpacity>
          </View>
          <Text style={styles.developedBy}>Developed By ♦</Text>
        </ScrollView>
      </View>

      <View style={[styles.AvatarCover, { top: headerHeight - 30 }]}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
      </View>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    width:180,
    height:180,
    borderWidth:1,
    
    //  width: '100%',
    // height: '35%', // Adjusted for better avatar placement
    // alignItems: 'center',
    // justifyContent: 'center',
    // overflow: 'hidden',
  },
  glass: {
   
    // alignSelf:"center"
  },
  body: {
    // 3. Remove flex: 1. The body will now be contained by the parent.
    width: '100%',
    // height: '100%', // Take up the full container height
    // backgroundColor: 'red',
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    // marginTop: -40,
    alignItems: 'center',
  },
  contentContainer: {
    paddingTop: 45, // Adjusted padding for avatar
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 20, // Add padding at the bottom for better scrolling
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    // 4. Remove marginTop: 'auto'. The footer will now scroll with the content.
    paddingBottom: 10,
  },
  // --- All other styles remain the same ---
  designation: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 1)',
    fontWeight: '300',
  },
  name: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, 1)',
    fontWeight: '600',
    marginBottom: 0,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  AvatarCover: {
    position: 'absolute',
    alignSelf: 'center',
    top:70,
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderColor: '#FFFFFF',
  },
  saveContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Reduced margin
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 5,
    padding: 4,
    width: '100%',
    justifyContent: 'center',
    borderColor: 'rgba(0, 0, 0, 0.15)',
  },
  saveContactText: {
    fontSize: 14, // Adjusted size
    fontWeight: '500',
    marginRight: 8,
    color: '#333',
  },
  whatsAppButton: {
    backgroundColor: 'rgba(3, 185, 1, 1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10, // Reduced margin
  },
  whatsAppButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    marginRight: 5, // Added margin for spacing
  },
  description: {
    fontSize: 10, // Adjusted size
    color: '#666',
    textAlign: 'center',
    marginBottom: 10, // Reduced margin
  },
  logo: {
    width: 25, // Adjusted size
    height: 25, // Adjusted size
    resizeMode: 'contain',
    marginBottom: 10, // Reduced margin
  },
  socialLinksContainer: {
    width: '100%',
    marginBottom: 10, // Reduced margin
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 10,
    marginBottom: 5, // Reduced margin
  },
  socialText: {
    marginLeft: 15,
    fontSize: 8,
    color: '#555',
  },
  footerIcon: {
    backgroundColor: 'rgba(134, 131, 152, 1)',
    borderRadius: 5,
    justifyContent: 'center',
    padding: 8, // Made padding consistent
  },
  developedBy: {
    fontSize: 10, // Adjusted size
    color: '#888',
    paddingTop: 10,
  },
});

export default DigitalBusinessCard;