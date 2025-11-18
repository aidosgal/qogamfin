import React from 'react';
import { Modal, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface AuthPromptModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  visible,
  onClose,
  title = 'Войдите чтобы получить доступ',
  description = 'Для просмотра этой страницы необходимо войти в аккаунт',
}) => {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push('/(auth)/login');
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 24, width: '100%', maxWidth: 384, padding: 32, alignItems: 'center' }}>
          {/* Icon */}
          <View style={{ width: 80, height: 80, backgroundColor: '#EFFE6D', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Ionicons name="lock-closed" size={40} color="#000" />
          </View>

          {/* Title */}
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 }}>
            {title}
          </Text>

          {/* Description */}
          <Text style={{ fontSize: 16, color: '#4B5563', textAlign: 'center', marginBottom: 32, lineHeight: 24 }}>
            {description}
          </Text>

          {/* Login Button */}
          <TouchableOpacity
            style={{ backgroundColor: '#EFFE6D', borderRadius: 9999, paddingVertical: 16, width: '100%', alignItems: 'center', marginBottom: 12 }}
            onPress={handleLogin}
          >
            <Text style={{ color: '#000', fontSize: 18, fontWeight: '600' }}>
              Войти
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={{ paddingVertical: 12, width: '100%', alignItems: 'center' }}
            onPress={onClose}
          >
            <Text style={{ color: '#4B5563', fontSize: 16, fontWeight: '500' }}>
              Отмена
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
