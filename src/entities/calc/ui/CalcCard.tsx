import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type CalcCardProps = {
  title: string;
  description: string;
  icon: string;
  url: string;
};

export const CalcCard: React.FC<CalcCardProps> = ({ title, description, icon, url }) => {
  const router = useRouter();

  const handlePress = () => {
    if (url && typeof url === "string") {
      router.push((url.startsWith("/") ? url : `/${url}`) as any);
    }
  };

  const isValidIcon = (name: string): name is keyof typeof Feather.glyphMap =>
    name in Feather.glyphMap;

  return (
        <TouchableOpacity
            onPress={handlePress}
            style={{
                display: "flex",
                flexDirection: "row",
                marginVertical: 6,
            }}
        >
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: 15,
                    backgroundColor: "#99BFFD",
                    marginRight: 10,
                }}
            >
                {isValidIcon(icon) ? (
                    <Feather name={icon} color="#015FF9" size={26} />
                ) : (
                    <Feather name="alert-circle" color="#015FF9" size={26} />
                )}
            </View>

            <View>
                <Text style={{ fontSize: 17, fontWeight: "500" }}>{title}</Text>
                <Text style={{ fontSize: 13, color: "#4A4A4A" }}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
};
