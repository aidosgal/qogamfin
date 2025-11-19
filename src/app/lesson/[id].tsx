import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Alert, Modal } from "react-native";
import { AuthGuard } from "@/src/features/auth/ui/AuthGuard";
import { useEffect, useState, useCallback } from "react";
import { lessonApi } from "@/src/entities/lessson/model/api/lessonApi";
import { LessonDetailed, Material } from "@/src/entities/lessson/model/types/lesson";
import YoutubePlayer from "react-native-youtube-iframe";
import Feather from "@expo/vector-icons/Feather";
import { CourseLessons } from "@/src/entities/course/model/types/course";
import { useTranslation } from "react-i18next";
import i18n from "@/src/shared/i18n/i18n";
import { WebView } from 'react-native-webview';

export default function LessonScreen() {
    const { id, courseId } = useLocalSearchParams<{ id: string; courseId?: string }>();
    const router = useRouter();
    const { t } = useTranslation();
    const [lesson, setLesson] = useState<LessonDetailed | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [nextLesson, setNextLesson] = useState<CourseLessons | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [allLessons, setAllLessons] = useState<CourseLessons[]>([]);
    const [viewingMaterial, setViewingMaterial] = useState<Material | null>(null);

    useEffect(() => {
        loadLesson();
    }, [id]);

    // Reload when language changes
    useEffect(() => {
        if (lesson !== null) {
            console.log('🔄 Language changed, reloading lesson...');
            loadLesson();
        }
    }, [i18n.language]);

    const loadLesson = async () => {
        try {
            setLoading(true);
            
            // Get lesson data from API
            const lessonResponse = await lessonApi.getLesson(Number(id));
            console.log('Lesson API response:', lessonResponse);
            
            // The API returns lesson data in a nested structure
            if (lessonResponse && lessonResponse.lesson) {
                const lessonData = lessonResponse.lesson;
                
                // Get current locale
                const currentLocale = i18n.language;
                
                // Find translation for current locale
                const translation = lessonData.translations?.find(
                    (t: any) => t.locale === currentLocale
                );
                
                // Convert to LessonDetailed format with localized content
                const lesson: LessonDetailed = {
                    id: lessonData.id,
                    title: translation?.title || lessonData.title,
                    description: translation?.description || lessonData.description,
                    video: translation?.video || lessonData.video,
                    course_id: lessonData.course_id,
                    order: 0,
                    favourite: lessonData.favourite || 0,
                    translations: lessonData.translations || [],
                };
                setLesson(lesson);
                
                // Set next lesson if available
                if (lessonData.next_lesson) {
                    setNextLesson(lessonData.next_lesson);
                }
                
                // Set all lessons from course if available
                if (lessonData.course && lessonData.course.lessons) {
                    setAllLessons(lessonData.course.lessons);
                }
                
                // Set materials if available
                if (lessonData.materials && Array.isArray(lessonData.materials)) {
                    console.log('📄 Materials received:', JSON.stringify(lessonData.materials, null, 2));
                    setMaterials(lessonData.materials);
                } else {
                    console.log('⚠️ No materials found in response');
                }
            }
        } catch (error) {
            console.error("Failed to load lesson:", error);
            Alert.alert(t('lesson.error_load'), t('lesson.error_load'));
        } finally {
            setLoading(false);
        }
    };

    const onStateChange = useCallback((state: string) => {
        if (state === "ended") {
            setPlaying(false);
            if (!isCompleted) {
                handleCompleteLesson();
            }
        }
    }, [isCompleted]);

    const handleCompleteLesson = async () => {
        try {
            await lessonApi.completeLesson(Number(id));
            setIsCompleted(true);
        } catch (error) {
            console.error("Failed to complete lesson:", error);
        }
    };

    const handleNextLesson = () => {
        if (nextLesson) {
            if (courseId) {
                router.push(`/lesson/${nextLesson.id}?courseId=${courseId}`);
            } else if (lesson?.course_id) {
                router.push(`/lesson/${nextLesson.id}?courseId=${lesson.course_id}`);
            } else {
                router.push(`/lesson/${nextLesson.id}`);
            }
        }
    };

    const handleOpenMaterial = async (material: Material) => {
        // Get the file path from content field or file_url/file_path
        const filePath = material.content || material.file_url || material.file_path;
        
        if (!filePath) {
            console.error('❌ No file path found in material');
            Alert.alert(t('lesson.error_open_file'), 'Файл не найден');
            return;
        }
        
        // Construct full URL
        const materialUrl = filePath.startsWith('http') 
            ? filePath 
            : `https://qogamfin.kz${filePath.startsWith('/') ? '' : '/'}${filePath}`;
        
        console.log('📂 Opening material URL:', materialUrl);
        setViewingMaterial({ ...material, file_url: materialUrl });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="#015FF9" />
            </View>
        );
    }

    if (!lesson) {
        return (
            <View style={styles.center}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text style={styles.errorText}>{t('lesson.not_found')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Video Player Section */}
            <View style={styles.videoContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Feather name="chevron-left" color="white" size={30} />
                </TouchableOpacity>
                
                {lesson.video && lesson.video.trim() !== '' ? (
                    <YoutubePlayer
                        height={250}
                        play={playing}
                        videoId={lesson.video}
                        onChangeState={onStateChange}
                    />
                ) : (
                    <View style={styles.center}>
                        <Text style={styles.errorText}>{t('lesson.no_video')}</Text>
                    </View>
                )}
            </View>

            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Lesson Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.title}>{lesson.title}</Text>
                    <Text style={styles.description}>{lesson.description}</Text>
                </View>

                {/* Materials Section */}
                {materials.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('lesson.materials')}</Text>
                        {materials.map((material) => (
                            <TouchableOpacity
                                key={material.id}
                                style={styles.materialCard}
                                onPress={() => handleOpenMaterial(material)}
                            >
                                <View style={styles.materialIcon}>
                                    <Feather name="file-text" size={24} color="#015FF9" />
                                </View>
                                <View style={styles.materialInfo}>
                                    <Text style={styles.materialTitle}>{material.title}</Text>
                                    <Text style={styles.materialType}>
                                        {material.file_type ? material.file_type.toUpperCase() : 'FILE'}
                                    </Text>
                                </View>
                                <Feather name="download" size={20} color="#9A9A9A" />
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Next Lesson Button */}
                {nextLesson && (
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNextLesson}
                    >
                        <Text style={styles.nextButtonText}>{t('lesson.next_lesson')}</Text>
                        <Feather name="arrow-right" size={20} color="white" />
                    </TouchableOpacity>
                )}

                {!nextLesson && (
                    <View style={styles.completionMessage}>
                        <Feather name="check-circle" size={48} color="#4CAF50" />
                        <Text style={styles.completionText}>
                            {t('lesson.completed_all')}
                        </Text>
                    </View>
                )}
            </ScrollView>
            
            {/* Material Viewer Modal */}
            <Modal
                visible={viewingMaterial !== null}
                animationType="slide"
                onRequestClose={() => setViewingMaterial(null)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setViewingMaterial(null)} style={styles.closeButton}>
                            <Feather name="x" size={24} color="#000" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{viewingMaterial?.title}</Text>
                    </View>
                    {viewingMaterial && viewingMaterial.file_url && (
                        <WebView
                            source={{ uri: viewingMaterial.file_url }}
                            style={styles.webview}
                            startInLoadingState={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            scalesPageToFit={true}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            mixedContentMode="always"
                            renderLoading={() => (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#015FF9" />
                                    <Text style={styles.loadingText}>Загрузка документа...</Text>
                                </View>
                            )}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.error('WebView error:', nativeEvent);
                                Alert.alert('Ошибка', 'Не удалось загрузить документ');
                            }}
                            onHttpError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.error('WebView HTTP error:', nativeEvent.statusCode);
                            }}
                        />
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: 60,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
    },
    videoContainer: {
        position: "relative",
        height: 250,
        backgroundColor: "#000000",
    },
    backButton: {
        position: "absolute",
        top: 10,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    infoSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#9A9A9A",
        lineHeight: 24,
    },
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 19,
        fontWeight: "600",
        color: "#000000",
        marginBottom: 12,
    },
    materialCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
    },
    materialIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    materialInfo: {
        flex: 1,
    },
    materialTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#000000",
        marginBottom: 4,
    },
    materialType: {
        fontSize: 14,
        color: "#9A9A9A",
    },
    nextButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#015FF9",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 24,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
        marginRight: 8,
    },
    completionMessage: {
        alignItems: "center",
        paddingVertical: 32,
        marginTop: 24,
    },
    completionText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#4CAF50",
        marginTop: 16,
        textAlign: "center",
    },
    errorText: {
        fontSize: 16,
        color: "#9A9A9A",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#FFFFFF',
    },
    closeButton: {
        padding: 8,
        marginRight: 12,
    },
    modalTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
    },
    webview: {
        flex: 1,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666666',
    },
});
