import { ProfileScreen } from "@/src/pages/profile";
import { Text, View } from "react-native";

export default function Profile() {
  return (
    <View style={{flex: 1, backgroundColor: "white", paddingTop: 60}}>
      <ProfileScreen />
    </View>
  )
}
