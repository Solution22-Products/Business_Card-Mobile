import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../utils/colors';
import InputComponent from '../../components/input';
import Toggle from '../../components/switch/index';
import { showToast } from '../../utils/toast';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createCard, updateCardById } from '../../services/newcard';

const fields = [
  {
    key: 'fullName',
    label: 'Full Name',
    icon: 'checkmark-circle-outline',
    placeholder: 'John Copper',
  },
  {
    key: 'designation',
    label: 'Designation',
    icon: 'checkmark-circle-outline',
    placeholder: 'Graphic Designer',
  },
  {
    key: 'company',
    label: 'Company Name',
    icon: 'checkmark-circle-outline',
    placeholder: 'Solution22',
  },
  {
    key: 'address',
    label: 'Address',
    icon: 'location-outline',
    placeholder: 'Melbourne, Australia',
  },
  {
    key: 'mobile',
    label: 'Mobile',
    icon: 'call-outline',
    placeholder: '00 0000 0000',
  },
  {
    key: 'email',
    label: 'Email',
    icon: 'mail-outline',
    placeholder: 'Solution22@gmail.com.au',
  },
  {
    key: 'website',
    label: 'Website',
    icon: 'checkmark-circle-outline',
    placeholder: 'www.Solution22.com.au',
  },
  {
    key: 'bio',
    label: 'Bio',
    icon: 'document-text-outline',
    placeholder: 'Write your bio...',
  },
];
interface AddInfoAndBioScreenProps {
  onNextStep: () => void;
  draftCardData: any;
  selectedThemeId: string | null;
}

const AddInfoAndBioScreen = ({
  onNextStep,
  draftCardData,
  selectedThemeId,
}: AddInfoAndBioScreenProps) => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const editCard = route.params?.card; // 👈 fetched from navigation

  const [selectedTab, setSelectedTab] = useState<'Details' | 'Bio'>('Details');
  const [saving, setSaving] = useState(false);
  const [canSave, setCanSave] = useState(false);

  const [enabled, setEnabled] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(fields.map(field => [field.key, true])),
  );
  const [formValues, setFormValues] = useState<{ [key: string]: string }>(
    Object.fromEntries(fields.map(field => [field.key, ''])),
  );

  useEffect(() => {
    if (editCard) {
      setFormValues({
        fullName: editCard.name || '',
        designation: editCard.designation || '',
        company: editCard.company || '',
        address: editCard.address || '',
        mobile: editCard.mobile || '',
        email: editCard.email || '',
        website: editCard.website || '',
        bio: editCard.bio || '',
      });

      const updatedEnabled: { [key: string]: boolean } = {};
      fields.forEach(field => {
        const value = editCard[field.key] ?? editCard[field.key.toLowerCase()];
        updatedEnabled[field.key] = value !== undefined && value !== '';
      });
      setEnabled(updatedEnabled);
    }
  }, []);

  useEffect(() => {
    console.log('🎨 Received theme from AboutStepScreen:', selectedThemeId);
  }, []);

  useEffect(() => {
    const filledCount = Object.entries(formValues).filter(
      ([key, value]) => enabled[key] && value.trim() !== '',
    ).length;

    console.log('🧮 Filled fields count:', filledCount);
    setCanSave(filledCount >= 2);
  }, [formValues, enabled]);

  const toggleSwitch = (key: string) => {
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const payload = {
        theme: selectedThemeId,
        full_name: formValues.fullName?.trim() || '',
        designation: formValues.designation,
        company: formValues.company,
        address: formValues.address,
        mobile: formValues.mobile,
        email: formValues.email,
        website: formValues.website,
        bio: formValues.bio,
      };

      let result;
      if (editCard) {
        result = await updateCardById(editCard.id, payload); // 👈 update
      } else {
        result = await createCard({ ...draftCardData, ...payload }); // 👈 create
      }

      showToast(
        'success',
        'Card Saved',
        'Your card has been saved successfully.',
      );

      onNextStep?.(); // for step flow
      navigation.goBack(); // or goBack() on update
    } catch (err: any) {
      console.error('❌ Save failed:', err);
      showToast('error', 'Save Failed', err.message ?? 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {editCard ? 'Edit Info & Bio' : 'Add Info & Bio'}
      </Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['Details', 'Bio'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab as 'Details' | 'Bio')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Card Fields */}
      <View style={styles.card}>
        {selectedTab === 'Details' ? (
          fields
            .filter(f => f.key !== 'bio')
            .map(field => (
              <View key={field.key} style={styles.fieldRow}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>{field.label}</Text>
                  <Toggle
                    isOn={enabled[field.key]}
                    onToggle={() => toggleSwitch(field.key)}
                    onColor={colors.primary}
                    offColor="#ccc"
                    style={styles.toggle}
                  />
                </View>

                {enabled[field.key] && (
                  <>
                    {['fullName', 'designation', 'company'].includes(
                      field.key,
                    ) ? (
                      <InputComponent
                        placeholder={field.placeholder}
                        value={formValues[field.key]}
                        onChangeText={text =>
                          setFormValues(prev => ({
                            ...prev,
                            [field.key]: text,
                          }))
                        }
                        showCheck
                      />
                    ) : (
                      <View style={styles.inputRow}>
                        <TextInput
                          style={styles.input}
                          placeholder={field.placeholder}
                          placeholderTextColor="#888"
                          value={formValues[field.key]}
                          onChangeText={text =>
                            setFormValues(prev => ({
                              ...prev,
                              [field.key]: text,
                            }))
                          }
                        />
                        <Ionicons name={field.icon} size={20} color="#555" />
                      </View>
                    )}
                  </>
                )}
              </View>
            ))
        ) : (
          // Bio tab
          <View style={styles.bioContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Bio</Text>
              <Toggle
                isOn={enabled.bio}
                onToggle={() =>
                  setEnabled(prev => ({ ...prev, bio: !prev.bio }))
                }
                onColor={colors.primary}
                offColor="#ccc"
                style={styles.toggle}
              />
            </View>

            {enabled.bio && (
              <TextInput
                style={styles.bioInput}
                placeholder="Write your bio here..."
                placeholderTextColor="#888"
                multiline
                numberOfLines={5}
                value={formValues.bio || ''}
                onChangeText={text =>
                  setFormValues(prev => ({ ...prev, bio: text }))
                }
              />
            )}
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text style={[styles.saveText, !canSave && styles.saveTextDisabled]}>
            {editCard ? 'Save Changes' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddInfoAndBioScreen;

const styles = StyleSheet.create({
  fieldRow: {
    marginBottom: 16,
  },
  toggle: {
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveTextDisabled: {
    color: '#888',
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 69,
    padding: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    color: '#000',
    // backgroundColor: 'red',
  },
  switch: {
    marginLeft: 8,
    height: 50,
    borderRadius: 15,
  },
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    justifyContent: 'space-between',
    gap: 20,
    // width:330,
  },
  tabButton: {
    flex: 1,
    borderRadius: 16,
    // paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  tabButtonActive: {
    flex: 1,
    borderRadius: 15,
    // paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#040404',
    padding: 16,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  tabTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    padding: 20,
    marginBottom: 30,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  backButton: {
    flex: 1,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#040404',
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bioContainer: {
    marginBottom: 16,
  },
  bioInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    fontSize: 14,
    textAlignVertical: 'top', // important for multiline
    color: '#000',
    height: 151,
  },
});
