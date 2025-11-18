import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { UserCard } from "../entities/user/ui/UserCard";
import { User } from "../entities/user/model/types/user";
import { useAuth } from "../features/auth/model/useAuth";
import { userApi } from "../entities/user/model/api/userApi";
import { useTranslation } from "react-i18next";

export const ProfileScreen: React.FC = () => {
  const { state, logout } = useAuth();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    if (!state.token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userInfo = await userApi.getUserInfo(state.token);
      setUser(userInfo);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch user info:', err);
      setError(err.message || 'Failed to load user info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [state.token]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>{t('profile.error_load')}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t('profile.no_data')}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <UserCard profile={user} onProfileUpdate={fetchUserInfo} />
    </View>
  );
};
