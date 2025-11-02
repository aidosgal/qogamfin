import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CourseLessons } from "../../course/model/types/course";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

type VideoThumbnailProps = {
    lesson: CourseLessons;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ lesson }) => {
    const thumbnail = `https://img.youtube.com/vi/${lesson.video}/maxresdefault.jpg`;
    const router = useRouter();
    
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
                onPress={() => router.push(`/lesson/${lesson.id}`)}
            >
                <Feather name="play" color="white" size={32} style={{ marginLeft: 3 }} />
            </TouchableOpacity>

            <Text style={styles.title}>{lesson.title}</Text>
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
