import React, { useMemo } from "react";
import { CourseLessons } from "../model/types/course";
import { Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

type CourseThumbnailProps = {
  lesson: CourseLessons;
};

export const CourseThumbnail: React.FC<CourseThumbnailProps> = ({ lesson }) => {
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
            <Text style={styles.title}>{localizedLesson.title}</Text>
            <TouchableOpacity
                style={styles.playButton}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
            >
                <Text style={styles.playButtonText}>{t('courses.continue_watching')}</Text>
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
