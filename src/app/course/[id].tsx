import { coursesService } from "@/src/entities/course/model/api/list";
import { CourseDetailed } from "@/src/entities/course/model/types/course";
import { LessonCard } from "@/src/entities/lessson/ui/LessonCard";
import { VideoThumbnail } from "@/src/entities/video/ui/VideoThumbnail";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, ScrollView } from "react-native";
import i18n from "@/src/shared/i18n/i18n";
import { useTranslation } from "react-i18next";
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@auth_token';

export default function Course() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { t } = useTranslation();
    const [course, setCourse] = useState<CourseDetailed | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCourse();
    }, [id]);

    const markCourseAsAttended = async (courseId: number) => {
        try {
            const token = await AsyncStorage.getItem(STORAGE_KEY);
            
            const response = await fetch(`https://qogamfin.kz/api/client/courses/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const result = await response.json();
            console.log('🟢 Course marked as attended:', result);
        } catch (error) {
            console.error('Failed to mark course as attended:', error);
        }
    };

    const loadCourse = async () => {
        try {
            setLoading(true);
            const data = await coursesService.getCourse(Number(id));
            
            // Apply translations based on current locale
            const currentLocale = i18n.language;
            const courseTranslation = data.translations?.find(t => t.locale === currentLocale);
            
            if (courseTranslation) {
                data.title = courseTranslation.title;
                data.description = courseTranslation.description;
                data.img = courseTranslation.img;
            }
            
            // Apply translations to lessons
            data.lessons = data.lessons.map(lesson => {
                const lessonTranslation = lesson.translations?.find(t => t.locale === currentLocale);
                if (lessonTranslation) {
                    return {
                        ...lesson,
                        title: lessonTranslation.title,
                        description: lessonTranslation.description,
                        video: lessonTranslation.video,
                    };
                }
                return lesson;
            });
            
            setCourse(data);
            
            // Mark course as attended after successfully loading
            await markCourseAsAttended(Number(id));
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
            <VideoThumbnail lesson={firstLesson} courseId={course.id} />
            <ScrollView style={{ paddingHorizontal: 20, flex: 1, marginBottom: 70 }} showsHorizontalScrollIndicator={false}>
                <Text style={{ fontSize: 22, fontWeight: 500, marginTop: 10 }}>{course.title}</Text>
                <Text style={{ fontSize: 17, marginTop: 5, color: "#9A9A9A" }}>{course.description}</Text>
                <Text style={{ fontSize: 19, fontWeight: 500, marginTop: 20 }}>{t('courses.content')}</Text>
                {course.lessons.map((lesson, index) => (
                    <LessonCard key={index} lesson={lesson} courseId={course.id} />
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
