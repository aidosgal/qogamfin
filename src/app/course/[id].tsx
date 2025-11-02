import { coursesService } from "@/src/entities/course/model/api/list";
import { CourseDetailed } from "@/src/entities/course/model/types/course";
import { LessonCard } from "@/src/entities/lessson/ui/LessonCard";
import { VideoThumbnail } from "@/src/entities/video/ui/VideoThumbnail";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, ScrollView } from "react-native";

export default function Course() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [course, setCourse] = useState<CourseDetailed | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            const data = await coursesService.getCourse(Number(id));
            setCourse(data);
        } catch (error) {
            console.error("Failed to load course:", error);
        } finally {
            setLoading(false);
        }
    };

    const firstLesson = course?.lessons?.[0];

    if (loading) {
        return (
            <View style={styles.center}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (!firstLesson) {
        return (
            <View style={styles.center}>
                <Stack.Screen options={{ headerShown: false }} />
                <View>
                    <ActivityIndicator size="small" />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <VideoThumbnail lesson={firstLesson} />
            <ScrollView style={{ paddingHorizontal: 20, flex: 1, marginBottom: 70 }} showsHorizontalScrollIndicator={false}>
                <Text style={{ fontSize: 22, fontWeight: 500, marginTop: 10 }}>{course.title}</Text>
                <Text style={{ fontSize: 17, marginTop: 5, color: "#9A9A9A" }}>{course.description}</Text>
                <Text style={{ fontSize: 19, fontWeight: 500, marginTop: 20 }}>Содержание</Text>
                {course.lessons.map((lesson, index) => (
                    <LessonCard key={index} lesson={lesson} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
