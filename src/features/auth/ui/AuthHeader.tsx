import React from 'react';
import { View, Text } from 'react-native';

export const AuthHeader = () => {
  return (
    <View style={{ marginBottom: 32 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 12 }}>Вход</Text>
      <Text style={{ fontSize: 16, color: '#4B5563', lineHeight: 24 }}>
        Введите номер телефона для входа или регистрации
      </Text>
    </View>
  );
};
