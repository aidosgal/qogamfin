import React from "react";
import { CourseLessons } from "../model/types/course";
import { Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

type CourseThumbnailProps = {
  lesson: CourseLessons;
};

export const CourseThumbnail: React.FC<CourseThumbnailProps> = ({ lesson }) => {
  const thumbnail = `https://img.youtube.com/vi/${lesson.video}/maxresdefault.jpg`;
  const router = useRouter();

  return (
        <ImageBackground
            source={{ uri: thumbnail }}
            style={styles.thumbnail}
            resizeMode="cover"
        >
            <StatusBar barStyle="light-content" translucent={false} backgroundColor="black" />

            <View style={styles.overlay} />
            <Image
                source={require("../../../../assets/images/logo.png")}
                style={{ height: 50, width: 90, alignSelf: "flex-start", marginLeft: 20 }}
                resizeMode="contain"
            />
            <Text style={styles.title}>{lesson.title}</Text>
            <TouchableOpacity
                style={styles.playButton}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
            >
                <Text style={styles.playButtonText}>Продолжить просмотр</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: "100%",
    height: 270,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    textAlign: "left",
    fontSize: 24,
    fontWeight: "500",
    color: "white",
    width: "70%",
    marginHorizontal: 20,
    marginTop: 10,
  },
  playButton: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#015FF9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
    marginLeft: 20,
  },
  playButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
    },
});
