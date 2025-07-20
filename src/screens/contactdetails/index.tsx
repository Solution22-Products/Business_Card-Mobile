// src/screens/ContactDetailsScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

export default function ContactDetailsScreen() {
  const route = useRoute<RouteProp<{ params: { card: any } }, 'params'>>();
  const { card } = route.params;

  const {
    email,
    mobile,
    company,
    website,
    address,
    note,
    lead_disclaimer,
    lead_form_header,
    created_at,
  } = card;

  const {
    full_name,
    designation,
    profile_url,
  } = card.card || {}; // Nested card details

  return (
    <ScrollView style={styles.container}>
      {profile_url ? (
        <Image source={{ uri: profile_url }} style={styles.avatar} />
      ) : null}

      {full_name && <Text style={styles.name}>{full_name}</Text>}
      {designation && <Text style={styles.designation}>{designation}</Text>}

      <View style={styles.infoContainer}>
        {email && (
          <Text style={styles.info}>
            📧 <Text style={styles.label}>Email:</Text> {email}
          </Text>
        )}
        {mobile && (
          <Text style={styles.info}>
            📞 <Text style={styles.label}>Mobile:</Text> {mobile}
          </Text>
        )}
        {company && (
          <Text style={styles.info}>
            🏢 <Text style={styles.label}>Company:</Text> {company}
          </Text>
        )}
        {website && (
          <Text style={styles.info}>
            🌐 <Text style={styles.label}>Website:</Text> {website}
          </Text>
        )}
        {address && (
          <Text style={styles.info}>
            📍 <Text style={styles.label}>Address:</Text> {address}
          </Text>
        )}
        {note && (
          <Text style={styles.info}>
            📝 <Text style={styles.label}>Note:</Text> {note}
          </Text>
        )}
        {lead_form_header && (
          <Text style={styles.info}>
            🗂 <Text style={styles.label}>Header:</Text> {lead_form_header}
          </Text>
        )}
        {lead_disclaimer && (
          <Text style={styles.info}>
            ⚠️ <Text style={styles.label}>Disclaimer:</Text> {lead_disclaimer}
          </Text>
        )}
        {created_at && (
          <Text style={styles.info}>
            ⏰ <Text style={styles.label}>Created:</Text>{' '}
            {new Date(created_at).toLocaleString()}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  designation: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoContainer: {
    marginTop: 8,
  },
  info: {
    fontSize: 14,
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
  },
});
