import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { AuthGuard } from "@/src/features/auth/ui/AuthGuard";

export default function LessonScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <AuthGuard
            title="Уроки"
            description="Войдите для доступа к урокам"
            icon="book"
        >
            <View style={{ flex: 1, backgroundColor: 'white', padding: 24 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Lesson {id}</Text>
            </View>
        </AuthGuard>
    )
}
