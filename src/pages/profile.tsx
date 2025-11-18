import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserCard } from "../entities/user/ui/UserCard";
import { User } from "../entities/user/model/types/user";
import { useAuth } from "../features/auth/model/useAuth";

export const ProfileScreen: React.FC = () => {
  const { state, logout } = useAuth();
  const [user] = useState<User>({
    id: state.user?.id || 1,
    first_name: state.user?.name?.split(' ')[0] || "Айдос",
    last_name: state.user?.name?.split(' ')[1] || "Галимжан",
    email: state.user?.phone || "test",
  });

  return (
    <View style={{ flex: 1 }}>
      <UserCard profile={user} />
    </View>
  );
};
