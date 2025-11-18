import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface AuthRequiredScreenProps {
  title?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const AuthRequiredScreen: React.FC<AuthRequiredScreenProps> = ({
  title = 'Требуется вход',
  description = 'Войдите, чтобы продолжить',
  icon = 'lock-closed',
}) => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
      {/* Icon */}
      <View style={{ 
        width: 140, 
        height: 140, 
        backgroundColor: '#3B82F6', 
        borderRadius: 70, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 40,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      }}>
        <Ionicons name={icon} size={64} color="#FFFFFF" />
      </View>

      {/* Title */}
      <Text style={{ 
        fontSize: 32, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 12,
        color: '#0F172A',
        letterSpacing: -0.5,
      }}>
        {title}
      </Text>

      {/* Description */}
      <Text style={{ 
        fontSize: 17, 
        color: '#64748B', 
        textAlign: 'center', 
        marginBottom: 56, 
        lineHeight: 26,
        paddingHorizontal: 24,
        fontWeight: '400',
      }}>
        {description}
      </Text>

      {/* Login Button */}
      <TouchableOpacity
        style={{ 
          backgroundColor: '#3B82F6', 
          borderRadius: 16, 
          paddingVertical: 18, 
          paddingHorizontal: 56,
          width: '100%',
          maxWidth: 340,
          alignItems: 'center',
          shadowColor: '#3B82F6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 6,
        }}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 }}>
          Войти в аккаунт
        </Text>
      </TouchableOpacity>

      {/* Additional Info */}
      <Text style={{ 
        fontSize: 15, 
        color: '#94A3B8', 
        textAlign: 'center', 
        marginTop: 28,
        lineHeight: 22,
        fontWeight: '500',
      }}>
        Быстрая авторизация за пару секунд
      </Text>
    </View>
  );
};
