import { ImageBackground, StyleSheet, TouchableOpacity, View, Animated } from "react-native";
import { Course } from "../model/types/course";
import { Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRef } from "react";
import { useRouter } from "expo-router";

type CourseCardProps = {
    course: Course;
    onPress?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
    const overlayOpacity = useRef(new Animated.Value(1)).current;
    const contentOpacity = useRef(new Animated.Value(1)).current;
    const image = { uri: `https://qogamfin.kz/${course.img}` };
    const router = useRouter();

    const handlePressIn = () => {
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(contentOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(contentOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePress = () => {
        if (onPress) {
            onPress();
        }
        router.push(`/(auth)/login`)
    };

    return (
        <TouchableOpacity
            style={{ borderRadius: 10 }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            activeOpacity={1}
        >
            <ImageBackground
                source={image}
                style={styles.container}
                borderRadius={10}
            >
                <Animated.View
                    style={[
                        styles.overlay,
                        { opacity: overlayOpacity }
                    ]}
                />

                <Animated.View
                    style={[
                        styles.content,
                        { opacity: contentOpacity }
                    ]}
                    pointerEvents="none"
                >
                    <View style={styles.lessonsContainer}>
                        <Feather name="youtube" size={18} color="white" />
                        <Text style={styles.lessonsText}>{course.lessons_count} уроков</Text>
                    </View>
                    <View style={{ marginTop: "auto" }}>
                        <Text style={styles.title}>{course.title}</Text>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Подробнее</Text>
                            <Feather name="arrow-down-right" color="white" size={16} style={{ marginLeft: "auto" }} />
                        </View>
                    </View>
                </Animated.View>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 240,
        borderRadius: 10,
        overflow: 'hidden',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    lessonsContainer: {
        marginLeft: "auto",
        flexDirection: "row",
        alignItems: "center",
    },
    lessonsText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "600",
    },
    title: {
        color: "white",
        fontSize: 15,
        fontWeight: "500",
    },
    button: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#015FF9",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginTop: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 13,
    }
});
