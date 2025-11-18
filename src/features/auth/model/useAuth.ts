import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState } from './types/auth';
import { authApi } from './api/authApi';

const STORAGE_KEY = '@auth_token';
const USER_KEY = '@auth_user';
const PHONE_KEY = '@auth_phone';

export const useAuth = () => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null,
    loginRequest: { phone: '', token: '' },
    otpInputs: ['', '', '', '', '', ''],
    countdown: 0,
  });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      loadStoredAuth();
      setHasLoaded(true);
    }
  }, [hasLoaded]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state.countdown > 0) {
      interval = setInterval(() => {
        setState((prev: AuthState) => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.countdown]);

  const loadStoredAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEY);
      const userStr = await AsyncStorage.getItem(USER_KEY);
      const phone = await AsyncStorage.getItem(PHONE_KEY);
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setState((prev: AuthState) => ({ ...prev, token, user }));
      }
      
      if (phone) {
        setState((prev: AuthState) => ({ 
          ...prev, 
          loginRequest: { ...prev.loginRequest, phone } 
        }));
      }
    } catch (error) {
      console.error('Failed to load auth', error);
    }
  };

  const updateState = (updates: Partial<AuthState>) => {
    setState((prev: AuthState) => ({ ...prev, ...updates }));
    
    // Save phone number to AsyncStorage when it's updated
    if (updates.loginRequest?.phone) {
      console.log('💾 [useAuth] Saving phone to AsyncStorage:', updates.loginRequest.phone);
      AsyncStorage.setItem(PHONE_KEY, updates.loginRequest.phone).catch(err => 
        console.error('Failed to save phone:', err)
      );
    }
  };

  const sendOtp = async () => {
    if (!state.loginRequest.phone) return;

    console.log('📱 [useAuth] Current state before sending OTP:', {
      phone: state.loginRequest.phone,
      otpInputs: state.otpInputs,
    });

    setState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

    try {
      console.log('Sending OTP to:', state.loginRequest.phone);
      
      // Try login first, if user exists
      try {
        const response = await authApi.sendLoginCode({
          phone: state.loginRequest.phone,
          channel: 'whatsapp',
        });
        
        console.log('Login code sent successfully:', response);
        
        setState((prev: AuthState) => ({ 
          ...prev, 
          loading: false, 
          countdown: 60,
          // Keep the phone number in state
        }));
        
        console.log('📱 [useAuth] State after OTP sent (login):', {
          phone: state.loginRequest.phone,
        });
        
        router.push('/(auth)/confirm' as any);
      } catch (loginError: any) {
        console.log('Login error:', loginError.message);
        
        // If user not found (404), try registration
        if (loginError.message.includes('не найден') || loginError.message.includes('not found') || loginError.message.includes('Пользователь')) {
          console.log('Trying registration instead...');
          
          const response = await authApi.sendAppCode({
            phone: state.loginRequest.phone,
            channel: 'whatsapp',
          });
          
          console.log('App code sent successfully:', response);
          
          setState((prev: AuthState) => ({ 
            ...prev, 
            loading: false, 
            countdown: 60,
            // Keep the phone number in state
          }));
          
          console.log('📱 [useAuth] State after OTP sent (registration):', {
            phone: state.loginRequest.phone,
          });
          
          router.push('/(auth)/confirm' as any);
        } else {
          throw loginError;
        }
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      
      setState((prev: AuthState) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to send OTP' 
      }));
      
      // Show error to user
      alert(error.message || 'Не удалось отправить код. Проверьте номер телефона.');
    }
  };

  const verifyOtp = async () => {
    const token = state.otpInputs.join('');
    
    console.log('🔐 [useAuth] verifyOtp called');
    console.log('🔐 [useAuth] OTP inputs array:', state.otpInputs);
    console.log('🔐 [useAuth] Joined token:', token);
    console.log('🔐 [useAuth] Token length:', token.length);
    console.log('🔐 [useAuth] Phone number:', state.loginRequest.phone);
    
    if (token.length !== 4) {
      console.warn('⚠️ [useAuth] Token length is not 4, exiting. Length:', token.length);
      return;
    }
    
    if (!state.loginRequest.phone) {
      console.warn('⚠️ [useAuth] Phone number is missing, exiting');
      return;
    }

    console.log('✅ [useAuth] Starting OTP verification...');
    setState((prev: AuthState) => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔵 [useAuth] Verifying OTP:', token, 'for phone:', state.loginRequest.phone);
      
      // Try login confirmation first
      try {
        const response = await authApi.confirmLoginCode({
          phone: state.loginRequest.phone,
          sms_code: token,
        });

        console.log('Login confirmed:', response);

        if (response.success && response.data) {
          await AsyncStorage.setItem(STORAGE_KEY, response.data.token);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
          await AsyncStorage.removeItem(PHONE_KEY); // Clear temp phone storage
          
          setState((prev: AuthState) => ({ 
            ...prev, 
            loading: false,
            user: response.data!.user,
            token: response.data!.token,
            otpInputs: ['', '', '', '', '', ''],
          }));
          
          router.replace('/(tabs)');
        }
      } catch (loginError: any) {
        console.log('Login confirm error:', loginError.message);
        
        // If login fails, try app confirmation (registration)
        if (loginError.message.includes('не найден') || loginError.message.includes('not found') || loginError.message.includes('Пользователь')) {
          console.log('Trying app confirmation instead...');
          
          const response = await authApi.confirmAppCode({
            phone: state.loginRequest.phone,
            sms_code: token,
          });

          console.log('App code confirmed:', response);

          if (response.success && response.token) {
            // For app registration, we need to get user data separately or use the token
            await AsyncStorage.setItem(STORAGE_KEY, response.token);
            await AsyncStorage.removeItem(PHONE_KEY); // Clear temp phone storage
            
            setState((prev: AuthState) => ({ 
              ...prev, 
              loading: false,
              token: response.token!,
              otpInputs: ['', '', '', '', '', ''],
            }));
            
            router.replace('/(tabs)');
          }
        } else {
          throw loginError;
        }
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      
      setState((prev: AuthState) => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Failed to verify OTP',
        otpInputs: ['', '', '', '', '', ''],
      }));
      
      // Show error to user
      alert(error.message || 'Неверный код. Попробуйте еще раз.');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(PHONE_KEY);
    setState({
      user: null,
      token: null,
      loading: false,
      error: null,
      loginRequest: { phone: '', token: '' },
      otpInputs: ['', '', '', '', '', ''],
      countdown: 0,
    });
    router.replace('/login');
  };

  return {
    state,
    updateState,
    sendOtp,
    verifyOtp,
    logout,
    isAuthenticated: !!state.token,
  };
};
