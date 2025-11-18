import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { CountryCode } from '../model/countryCodes';

interface CountryModalProps {
  visible: boolean;
  countryCodes: CountryCode[];
  onSelect: (country: CountryCode) => void;
  onClose: () => void;
}

export const CountryModal: React.FC<CountryModalProps> = ({
  visible,
  countryCodes,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' }}>
            <View style={{ padding: 24, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
              <Text style={{ fontSize: 20, fontWeight: '600', textAlign: 'center' }}>Выберите страну</Text>
            </View>
            
            <ScrollView style={{ flex: 1 }}>
              {countryCodes.map((country, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
                  onPress={() => onSelect(country)}
                >
                  <Text style={{ fontSize: 30, marginRight: 16 }}>{country.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{country.name}</Text>
                  </View>
                  <Text style={{ fontSize: 16, color: '#4B5563' }}>{country.code}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={{ padding: 24, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}
              onPress={onClose}
            >
              <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: '600', color: '#374151' }}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
