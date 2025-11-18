import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { CountryCode } from '../model/countryCodes';

interface PhoneInputProps {
  selectedCountry: CountryCode;
  phoneNumber: string;
  onCountryPress: () => void;
  onPhoneChange: (text: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  selectedCountry,
  phoneNumber,
  onCountryPress,
  onPhoneChange,
}) => {
  return (
    <View>
      <Text style={{ fontSize: 14, color: '#4B5563', marginBottom: 8, fontWeight: '500' }}>Номер телефона</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
        <TouchableOpacity 
          onPress={onCountryPress}
          style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}
        >
          <Text style={{ fontSize: 24, marginRight: 8 }}>{selectedCountry.flag}</Text>
          <Text style={{ fontSize: 16, fontWeight: '500', marginRight: 4 }}>{selectedCountry.code}</Text>
          <Entypo name="chevron-down" size={18} color="#666" />
        </TouchableOpacity>
        
        <View style={{ height: 24, width: 1, backgroundColor: '#D1D5DB', marginRight: 12 }} />
        
        <TextInput
          style={{ flex: 1, fontSize: 16 }}
          placeholder="000 000 00 00"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={onPhoneChange}
          maxLength={15}
          autoFocus
        />
      </View>
    </View>
  );
};
