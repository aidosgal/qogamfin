import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, FlatList, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Course } from "../entities/course/model/types/course";
import { coursesService } from "../entities/course/model/api/list";
import { CourseCard } from "../entities/course/ui/CourseCard";

export const CoursesScreen: React.FC = () => {
    const { i18n, t } = useTranslation();
    const [courses, setCourses] = useState<Course[]>([]);
    const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadCourses();
    }, []);

    useEffect(() => {
        handleSearch(searchQuery);
    }, [searchQuery, courses, i18n.language]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const data = await coursesService.getCourses();
            setCourses(data);
            setFilteredCourses(data);
        } catch (error) {
            console.error('Failed to load courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLocalizedContent = (course: Course) => {
        const translation = course.translations.find(
            (t) => t.locale === i18n.language
        );
        return {
            title: translation?.title || course.title,
            description: translation?.description || course.description,
            img: translation?.img || course.img,
        };
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter((course) => {
                const content = getLocalizedContent(course);
                return (
                    content.title.toLowerCase().includes(query.toLowerCase()) ||
                    content.description.toLowerCase().includes(query.toLowerCase())
                );
            });
            setFilteredCourses(filtered);
        }
    };

    const renderCourseItem = ({ item }: { item: Course }) => {
        return (
            <View style={styles.gridItem}>
                <CourseCard course={item} />
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#20BDFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder={t('courses.search_placeholder')}
                placeholderTextColor={"#999"}
                value={searchQuery}
                onChangeText={handleSearch}
            />

            <FlatList
                data={filteredCourses}
                renderItem={renderCourseItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{t('courses.no_courses')}</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 70,
        paddingHorizontal: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    search: {
        textAlign: "center",
        fontSize: 17,
        fontWeight: "500",
        paddingVertical: 18,
        backgroundColor: "#F1F1F1",
        borderRadius: 100,
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 120,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    gridItem: {
        flex: 1,
        maxWidth: '48%',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        width: '100%',
    },
    emptyText: {
        fontSize: 16,
        color: '#999999',
    },
});
