import React, { useMemo } from "react";
import { CourseLessons } from "../../course/model/types/course";
import { Image, Text, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

type LessonCardProps = {
    lesson: CourseLessons;
    courseId?: number;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, courseId }) => {
  const router = useRouter();
  const { i18n, t } = useTranslation();

  // Apply translations based on current locale
  const localizedLesson = useMemo(() => {
    const translation = lesson.translations?.find(t => t.locale === i18n.language);
    return {
      title: translation?.title || lesson.title,
      description: translation?.description || lesson.description,
      video: translation?.video || lesson.video,
    };
  }, [lesson, i18n.language]);

    const thumbnail = `https://img.youtube.com/vi/${localizedLesson.video}/maxresdefault.jpg`;

    const handlePress = () => {
        if (courseId) {
            router.push(`/lesson/${lesson.id}?courseId=${courseId}`);
        } else {
            router.push(`/lesson/${lesson.id}`);
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress}>
            <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
            <View style={styles.content}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
                    {localizedLesson.title}
                </Text>
                <View style={styles.statusRow}>
                    <Feather name="circle" size={20} color="#015FF9" />
                    <Text style={styles.statusText}>{t('courses.not_watched')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        borderRadius: 12,
        marginTop: 10,
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    thumbnail: {
        height: 100,
        width: 100,
    },
    content: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        width: SCREEN_WIDTH - 150,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    statusText: {
        fontSize: 14,
      color: "#99BFFD",
      fontWeight: 500,
        marginLeft: 4,
    },
});
