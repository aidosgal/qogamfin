import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CourseLessons } from "../../course/model/types/course";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

type VideoThumbnailProps = {
    lesson: CourseLessons;
    courseId?: number;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ lesson, courseId }) => {
    const router = useRouter();
    const { i18n } = useTranslation();

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
    
    const handlePlayPress = () => {
        if (courseId) {
            router.push(`/lesson/${lesson.id}?courseId=${courseId}`);
        } else {
            router.push(`/lesson/${lesson.id}`);
        }
    };
    
    return (
        <ImageBackground
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
        >
            <View style={styles.overlay} />

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Feather name="chevron-left" color="white" size={30} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayPress}
            >
                <Feather name="play" color="white" size={32} style={{ marginLeft: 3 }} />
            </TouchableOpacity>

            <Text style={styles.title}>{localizedLesson.title}</Text>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    thumbnail: {
        width: "100%",
        height: 300,
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    backButton: {
        position: "absolute",
        top: 60,
        left: 20,
        zIndex: 10,
    },
    playButton: {
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#015FF9",
        borderRadius: 35,
    },
    title: {
        position: "absolute",
        bottom: 40,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "500",
        color: "white",
        width: "70%",
        alignSelf: "center",
    },
});
