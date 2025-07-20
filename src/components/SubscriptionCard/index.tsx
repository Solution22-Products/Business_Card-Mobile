import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../utils/colors';
import PrimaryButton from '../button/primarybutton';
import IMAGES from '../../constants';

interface SubscriptionCardProps {
  plan: string;
  endDate: string;
  progress?: number; // 0 - 100
  onRenewPress?: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  endDate,
  progress = 70,
  onRenewPress,
}) => {
  return (
    <ImageBackground
      source={IMAGES.SubscriptionCard} // ← your custom background
      style={styles.container}
      imageStyle={{ borderRadius: 20 }} // ensure rounded corners apply to image
    >
      <Text style={styles.title}>My Subscription</Text>
      <Text style={styles.plan}>{plan}</Text>
      <Text style={styles.endDate}>End Date · {endDate}</Text>

      {/* Progress bar wrapper */}
      <View style={styles.progressBarContainer}>
        {/* White full background bar */}
        <View style={styles.progressBackground} />

        {/* Colored progress fill */}
        <LinearGradient
          colors={['#00C851', '#ffbb33', '#ff4444']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressFill, { width: `${progress}%` }]}
        />
      </View>

      <PrimaryButton
        radius={30}
        bgColor="#FFFFFF"
        title="Renew Subscription"
        onPress={onRenewPress}
        style={styles.button}
        textStyle={{ color: 'black' }}
        // textColor='#000'
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 20,
    backgroundColor: '#FF7300',
    overflow: 'hidden',
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  plan: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginVertical: 4,
  },
  endDate: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  button: {
    alignSelf: 'flex-start',
  },
});

export default SubscriptionCard;
