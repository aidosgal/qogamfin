import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useAuth } from '@/src/features/auth/model/useAuth';
import { cleanPhoneNumber } from '@/src/features/auth/lib/utils';
import { countryCodes, CountryCode } from '@/src/features/auth/model/countryCodes';
import { CountryModal } from '@/src/features/auth/ui/CountryModal';
import { AuthHeader } from '@/src/features/auth/ui/AuthHeader';
import { PhoneInput } from '@/src/features/auth/ui/PhoneInput';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function LoginScreen() {
  const { state, updateState, sendOtp } = useAuth();
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const onPhoneChange = (phone: string) => {
    console.log('📞 [Login] Phone number updated:', phone);
    updateState({
      loginRequest: { ...state.loginRequest, phone }
    });
  };

  const handlePhoneChange = (text: string) => {
    let cleaned = cleanPhoneNumber(text);
    // Remove leading zero if present
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }
    if (cleaned.length <= 11) {
      setPhoneNumber(text);
      // Format phone number correctly - remove + from country code for API
      const countryCode = selectedCountry.code.replace('+', '');
      const fullPhone = `${countryCode}${cleaned}`;
      console.log('Phone number formatted:', fullPhone);
      onPhoneChange(fullPhone);
    }
  };

  const handleCountrySelect = (country: CountryCode) => {
    setSelectedCountry(country);
    setIsModalVisible(false);
    let cleaned = cleanPhoneNumber(phoneNumber);
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.slice(1);
    }
    // Format phone number correctly - remove + from country code for API
    const countryCode = country.code.replace('+', '');
    const fullPhone = `${countryCode}${cleaned}`;
    console.log('Country changed, phone number formatted:', fullPhone);
    onPhoneChange(fullPhone);
  };

  return (
    <View style={{ paddingBottom: 48, height: '100%', backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flex: 1, paddingBottom: 48 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
              {/* Back Button and Title */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 32 }}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{ marginRight: 16 }}
                >
                  <Feather name="chevron-left" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Вход</Text>
              </View>
              
              <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24, marginBottom: 32 }}>
                Введите номер телефона для входа или регистрации
              </Text>
              
              <PhoneInput
                selectedCountry={selectedCountry}
                phoneNumber={phoneNumber}
                onCountryPress={() => setIsModalVisible(true)}
                onPhoneChange={handlePhoneChange}
              />
            </View>
            <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16, lineHeight: 20 }}>
                Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности Qogam Fin
              </Text>
              <TouchableOpacity
                style={{
                  borderRadius: 9999,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: !state.loginRequest.phone || state.loading ? '#93C5FD' : '#015FF9'
                }}
                onPress={sendOtp}
                disabled={!state.loginRequest.phone || state.loading}
              >
                {state.loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '600' }}>
                    Получить SMS код
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <CountryModal
        visible={isModalVisible}
        countryCodes={countryCodes}
        onSelect={handleCountrySelect}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
}
