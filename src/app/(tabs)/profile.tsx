import { ProfileScreen } from "@/src/pages/profile";
import { Text, View } from "react-native";
import { AuthGuard } from "@/src/features/auth/ui/AuthGuard";

export default function Profile() {
  return (
    <AuthGuard
      title="Профиль"
      description="Войдите для доступа к профилю"
      icon="person-circle"
    >
      <View style={{flex: 1, backgroundColor: "white", paddingTop: 60}}>
        <ProfileScreen />
      </View>
    </AuthGuard>
  )
}
