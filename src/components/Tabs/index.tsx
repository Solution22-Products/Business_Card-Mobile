import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors';

interface TabSwitchProps {
  tabs: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

const TabSwitch: React.FC<TabSwitchProps> = ({ tabs, selectedIndex, onChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              selectedIndex === index && styles.tabSelected
            ]}
            onPress={() => onChange(index)}
          >
            <Text style={[
              styles.tabText,
              selectedIndex === index && styles.tabTextSelected
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#fff',
  },
  tabSelected: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.primary,
    fontWeight: '500',
  },
  tabTextSelected: {
    color: '#fff',
  },
});

export default TabSwitch;
