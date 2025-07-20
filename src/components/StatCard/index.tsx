import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors';

interface StatCardProps {
  iconName: string;
  value: number;
  label: string;
  deltaPositive?: boolean;
  source: any;
}

const StatCard: React.FC<StatCardProps> = ({
  iconName,
  value,
  source,
  label,
  deltaPositive = true,
}) => {
  return (
    <View style={styles.wrapper}>
      {/* Floating Arrow */}
      <View style={styles.arrowWrapper}>
        <Ionicons
          name={deltaPositive ? 'arrow-up-circle' : 'arrow-down-circle'}
          size={28}
          color={deltaPositive ? colors.success : colors.danger}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>

      {/* Card */}
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Image source={source} style={styles.image} resizeMode="contain" />
          <Text style={styles.value}>{value}</Text>
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const CARD_WIDTH = 150;

const styles = StyleSheet.create({
  wrapper: {
    width: CARD_WIDTH,
    alignItems: 'flex-end',
    // justifyContent:"space-between"
    marginRight: 40,
  },
  arrowWrapper: {
    position: 'absolute',
    top: 85,
    zIndex: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight:20
  },
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 33,
    height: 36,
  },
  value: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginTop: 12,
    opacity: 0.8,
  },
});

export default StatCard;
