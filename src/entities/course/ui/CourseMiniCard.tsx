import { ImageBackground, StyleSheet, TouchableOpacity, View, Animated, Text } from "react-native";
import { Course } from "../model/types/course";
import { useRef, useMemo } from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

type CourseCardProps = {
  course: Course;
  onPress?: () => void;
};

export const CourseMiniCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const router = useRouter();
  const { i18n } = useTranslation();

  // Apply translations based on current locale
  const localizedContent = useMemo(() => {
    const translation = course.translations?.find(t => t.locale === i18n.language);
    return {
      title: translation?.title || course.title,
      description: translation?.description || course.description,
      img: translation?.img || course.img,
    };
  }, [course, i18n.language]);

  const image = { uri: `https://qogamfin.kz/${localizedContent.img}` };

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
      }),
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
      }),
    ]).start();
  };

  const handlePress = () => {
    if (onPress) onPress();
    router.push(`/course/${course.id}`);
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity
        style={styles.touchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={1}
      >
        <ImageBackground
          source={image}
          style={styles.imageBackground}
          imageStyle={styles.imageStyle}
        >
          <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
          <Animated.View style={[styles.content, { opacity: contentOpacity }]} pointerEvents="none">
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {localizedContent.title}
            </Text>
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {localizedContent.description}
            </Text>
          </Animated.View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 150, // ✅ enforce total height
    width: 250,
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 10,
  },
  touchable: {
    flex: 1, // ✅ fill parent only, not more
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-start",
  },
  imageStyle: {
    borderRadius: 15,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
  },
  description: {
        color: "#F5F5F5",
        fontSize: 12,
        fontWeight: "400",
        marginTop: 4,
    },
});
