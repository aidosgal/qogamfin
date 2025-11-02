import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function LessonScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <View>
            <Text>Lesson {id}</Text>
        </View>
    )
}
