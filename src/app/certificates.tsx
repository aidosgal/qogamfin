import React from "react";
import { View, StyleSheet } from "react-native";
import { CertificatesScreen } from "@/src/pages/certificates";
import { AuthGuard } from "@/src/features/auth/ui/AuthGuard";
import { Stack } from "expo-router";

export default function Certificates() {
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }} 
      />
      <AuthGuard
        title="Сертификаты"
        description="Войдите для просмотра ваших сертификатов"
        icon="award"
      >
        <View style={styles.container}>
          <CertificatesScreen />
        </View>
      </AuthGuard>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
