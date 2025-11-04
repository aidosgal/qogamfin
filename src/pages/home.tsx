import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Course, CourseDetailed } from "../entities/course/model/types/course";
import { coursesService } from "../entities/course/model/api/list";
import { CourseThumbnail } from "../entities/course/ui/CourseThumbnail";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { CourseMiniCard } from "../entities/course/ui/CourseMiniCard";
import { CalcCard } from "../entities/calc/ui/CalcCard";
import { CalcGrid } from "../entities/calc/ui/CalcGrid";

export const HomeScreen: React.FC = () => {
  const [course, setCourse] = useState<CourseDetailed>();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [images] = useState<string[]>([
    "https://qogamfin.kz/images/freedom.webp",
    "https://qogamfin.kz/images/jusan_new.webp",
    "https://qogamfin.kz/images/halyk.webp",
    "https://qogamfin.kz/images/bereke.webp",
    "https://qogamfin.kz/images/nurbank.webp",
    "https://qogamfin.kz/images/rbk.webp",
    "https://qogamfin.kz/images/amanat.webp",
    "https://qogamfin.kz/images/hcb.webp",
    "https://qogamfin.kz/images/centercredit.webp",
    "https://qogamfin.kz/images/forte.webp",
    "https://qogamfin.kz/images/eurasian.webp",
  ]);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const data = await coursesService.getCourses();
      setCourses(data);
      const detailed = await coursesService.getCourse(data?.[1].id);
      setCourse(detailed);
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
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!firstLesson) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: "https://your-image-url-here.jpg" }}
      style={styles.background}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <CourseThumbnail lesson={firstLesson} />

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/courses")}
          style={styles.sectionHeader}
        >
          <Text style={styles.sectionTitle}>Все Курсы</Text>
          <Feather name="chevron-right" size={25} color="black" />
        </TouchableOpacity>

        <View style={{ marginTop: 10 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, gap: 10 }}
          >
            {courses?.map((course, index) => (
              <CourseMiniCard course={course} key={index} />
            ))}
          </ScrollView>
        </View>

        {/* Partners */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Наши партнеры</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.partnersList}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.partnerLogo}
            />
          ))}
        </ScrollView>

        <CalcGrid />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: "transparent",
    marginBottom: 80,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  partnersList: {
    paddingLeft: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  partnerLogo: {
    width: 100,
    height: 50,
    marginRight: 15,
    marginTop: 20,
    resizeMode: "contain",
  },
  calcGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 10, // 🔥 reduced spacing
        gap: 15, // nice modern gap between cards
    },
});
