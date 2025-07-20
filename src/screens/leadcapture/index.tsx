import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors';

import Toggle from '../../components/switch/index';

const formFields = [
  'First Name',
  'Last Name',
  'Mobile',
  'Email',
  'Designation',
  'Note',
];

const LeadCaptureScreen = () => {
  const [enabledFields, setEnabledFields] = useState<{
    [key: string]: boolean;
  }>({
    'First Name': true,
    'Last Name': true,
    Mobile: true,
    Email: true,
    Designation: true,
    Note: true,
  });

  const toggleField = (field: string) => {
    setEnabledFields(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Lead Capture</Text>

        {/* Header Field */}
        <Text style={styles.label}>Form Header</Text>
        <TextInput
          style={styles.input}
          placeholder="Share Back Your Contact"
          placeholderTextColor="#888"
        />

        {/* Disclaimer Field */}
        <Text style={styles.label}>Disclaimer</Text>
        <TextInput
          style={styles.input}
          placeholder="We won’t sell or share your data"
          placeholderTextColor="#888"
        />

        {/* Fields with Switches */}
        {formFields.map(field =>
          enabledFields[field] ? (
            <View key={field} style={styles.switchRow}>
              <Ionicons name="reorder-three" size={22} color="#000" />
              <Text style={styles.fieldText}>{field}</Text>
              <View style={{ flex: 1 }} />
              <Toggle
                isOn={enabledFields[field]}
                onToggle={() => toggleField(field)}
                onColor={colors.primary}
                offColor="#ccc"
              />
            </View>
          ) : (
            <View key={field} style={styles.switchRow}>
              <Ionicons name="reorder-three" size={22} color="#000" />
              <Text style={styles.fieldText}>{field}</Text>
              <View style={{ flex: 1 }} />
              <Switch
                value={false}
                onValueChange={() => toggleField(field)}
                trackColor={{ false: '#ccc', true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          ),
        )}

        {/* Preview Button */}
        <TouchableOpacity style={styles.previewButton}>
          <Ionicons name="eye-outline" size={20} color="#fff" />
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F4F4F4',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F1F1F1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    fontSize: 14,
    marginBottom: 16,
    color: '#000',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  fieldText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  previewButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    alignSelf: 'center',
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  previewText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default LeadCaptureScreen;
