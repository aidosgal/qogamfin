import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/src/features/auth/model/useAuth';
import { useRouter } from 'expo-router';
import type { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

export default function ConfirmScreen() {
  const { state, updateState, sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  console.log('🔄 [Confirm] Screen rendered, current phone:', state.loginRequest.phone);

  const onOtpChange = (text: string, index: number) => {
    console.log(`📝 [Confirm] OTP input changed at index ${index}:`, text);
    const newOtpInputs = [...state.otpInputs];
    newOtpInputs[index] = text;
    
    const token = newOtpInputs.join('');
    console.log('📝 [Confirm] Full OTP token:', token, 'Length:', token.length);
    
    updateState({
      otpInputs: newOtpInputs,
      loginRequest: { ...state.loginRequest, token }
    });
  };

  const handleOtpChange = (text: string, index: number) => {
    console.log(`⌨️ [Confirm] handleOtpChange called - text: "${text}", index: ${index}`);
    
    if (text.length > 1) {
      console.log('📋 [Confirm] Paste detected, processing...');
      const numericText = text.replace(/[^0-9]/g, '').slice(0, 4);
      const newOtpInputs = ['', '', '', '', '', ''];

      for (let i = 0; i < Math.min(numericText.length, 4); i++) {
        newOtpInputs[i] = numericText[i];
      }

      console.log('📋 [Confirm] Pasted OTP inputs:', newOtpInputs.slice(0, 4));

      for (let i = 0; i < 4; i++) {
        onOtpChange(newOtpInputs[i], i);
      }

      const nextIndex = Math.min(numericText.length, 3);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 0);
    } else {
      const numericText = text.replace(/[^0-9]/g, '');
      console.log('⌨️ [Confirm] Single digit input:', numericText);
      onOtpChange(numericText, index);

      if (numericText && index < 3) {
        console.log(`➡️ [Confirm] Moving focus to next input (${index + 1})`);
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 0);
      }
    }
  };

  const handleVerifyPress = () => {
    const token = state.otpInputs.join('');
    const filledInputs = state.otpInputs.filter((input: string) => input !== '').length;
    
    console.log('🔐 [Confirm] Verify button pressed');
    console.log('🔐 [Confirm] OTP inputs:', state.otpInputs);
    console.log('🔐 [Confirm] Joined token:', token);
    console.log('🔐 [Confirm] Filled inputs count:', filledInputs);
    console.log('🔐 [Confirm] Phone:', state.loginRequest.phone);
    console.log('🔐 [Confirm] Can verify?', filledInputs === 4 && !state.loading);
    
    if (filledInputs === 4 && !state.loading) {
      console.log('✅ [Confirm] Calling verifyOtp...');
      verifyOtp();
    } else {
      console.warn('⚠️ [Confirm] Cannot verify - requirements not met');
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !state.otpInputs[index] && index > 0) {
      setTimeout(() => {
        inputRefs.current[index - 1]?.focus();
      }, 0);
    }
  };

  return (
    <View style={{ paddingBottom: 48, height: '100%', backgroundColor: 'white' }}>
      <KeyboardAvoidingView 
        style={{ flex: 1, paddingBottom: 48 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 40 }}>
              <View style={{ marginTop: 8 }}>
                <TouchableOpacity
                  onPress={() => router.back()}
                >
                  <Feather name="chevron-left" size={28} color="black" />
                </TouchableOpacity>
                <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 8, marginTop: 16, textAlign: 'center' }}>Код подтверждения</Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 8, color: '#6B7280' }}>
                  Введите 4-значный код подтверждения, отправленный на номер
                </Text>
              </View>
              
              <View style={{ marginBottom: 12, marginTop: 40 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingHorizontal: 40 }}>
                  {[0, 1, 2, 3].map((index) => (
                    <View key={index} style={{ flex: 1 }}>
                      <TextInput
                        ref={(ref: TextInput | null) => { inputRefs.current[index] = ref; }}
                        style={{
                          width: '100%',
                          fontSize: 24,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          textAlign: 'center',
                          backgroundColor: '#F3F3F3',
                          paddingVertical: Platform.OS === 'ios' ? 16 : 12,
                          textAlignVertical: 'center',
                          includeFontPadding: false,
                          lineHeight: Platform.OS === 'android' ? 22 : undefined
                        }}
                        value={state.otpInputs[index] || ''}
                        onChangeText={(text: string) => handleOtpChange(text, index)}
                        onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={index === 0 ? 4 : 1}
                        textAlign="center"
                        autoFocus={index === 0}
                        selectionColor="black"
                      />
                    </View>
                  ))}
                </View>
              </View>

              <View style={{ marginTop: 8, marginHorizontal: 'auto' }}>
                <TouchableOpacity
                  onPress={sendOtp}
                  disabled={state.countdown > 0}
                >
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: state.countdown > 0 ? '#9CA3AF' : '#319885'
                  }}>
                    {state.countdown > 0 
                      ? `Повторить через ${state.countdown}с` 
                      : 'Отправить код повторно'
                    }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16, lineHeight: 20 }}>
                Код действителен в течение 5 минут.{' '}
                Проверьте папку "Спам", если не видите SMS.
              </Text>
              
              <TouchableOpacity
                style={{
                  borderRadius: 9999,
                  paddingVertical: 16,
                  alignItems: 'center',
                  backgroundColor: (state.otpInputs.filter((input: string) => input !== '').length !== 4 || state.loading) ? '#F9FFC5' : '#EFFE6D'
                }}
                onPress={handleVerifyPress}
                disabled={state.otpInputs.filter((input: string) => input !== '').length !== 4 || state.loading}
              >
                {state.loading ? (
                  <ActivityIndicator color="#000" size="small" />
                ) : (
                  <Text style={{ color: '#000', fontSize: 18, fontWeight: '600' }}>
                    Подтвердить код
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}
