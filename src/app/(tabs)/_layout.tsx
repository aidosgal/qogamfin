import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { View, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#015FF9",
          tabBarInactiveTintColor: "#8E8E93",
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 60,
            left: 40,
            right: 40,
            height: 70,
            marginHorizontal: 20,
            borderRadius: 100,
            backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.95)',
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            paddingBottom: 10,
            paddingTop: 10,
            paddingHorizontal: 15,
          },
          tabBarBackground: () => (
            Platform.OS === 'ios' ? (
              <BlurView
                intensity={30}
                tint="light"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 100,
                  overflow: 'hidden',
                }}
              />
            ) : null
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Главная',
            tabBarIcon: ({ color }: { color: string }) => (
              <Feather name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="courses"
          options={{
            title: 'Уроки',
            tabBarIcon: ({ color }: { color: string }) => (
              <Feather name="cast" size={24} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="consults"
          options={{
            title: 'Консалтинг',
            tabBarIcon: ({ color }: { color: string }) => (
              <Feather name="info" size={24} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            tabBarIcon: ({ color }: { color: string }) => (
              <Feather name="user" size={24} color={color} />
            )
          }}
        />
      </Tabs>
    </View>
  );
}
