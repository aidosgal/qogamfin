import React from "react";
import { CourseLessons } from "../../course/model/types/course";
import { Image, Text, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

type LessonCardProps = {
    lesson: CourseLessons;
    courseId?: number;
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, courseId }) => {
  const router = useRouter();
    const thumbnail = `https://img.youtube.com/vi/${lesson.video}/maxresdefault.jpg`;

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
                    {lesson.title}
                </Text>
                <View style={styles.statusRow}>
                    <Feather name="circle" size={20} color="#015FF9" />
                    <Text style={styles.statusText}>Не просмотрено</Text>
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
