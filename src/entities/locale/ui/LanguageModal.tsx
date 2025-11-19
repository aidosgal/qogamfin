import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Animated,
    Pressable,
    ScrollView
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

type LanguageModalProps = {
    visible: boolean;
    onClose: () => void;
};

type LanguageOption = {
    code: string;
    label: string;
    native: string;
    flag: string;
};

const LANG_KEY = "user-language";

export const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose }) => {
    const { i18n } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(300))[0];
    const [selectedLang, setSelectedLang] = useState<string>(i18n.language);

    const languages: LanguageOption[] = [
        { code: "ru", label: "Русский", native: "Russian", flag: "🇷🇺" },
        { code: "kk", label: "Қазақша", native: "Kazakh", flag: "🇰🇿" },
    ];

    // handle animation
    useEffect(() => {
        if (visible) {
            setIsVisible(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 65,
                    friction: 11,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 300,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start(() => setIsVisible(false));
        }
    }, [visible]);

    // load saved language
    useEffect(() => {
        const loadLang = async () => {
            const savedLang = await AsyncStorage.getItem(LANG_KEY);
            if (savedLang && savedLang !== i18n.language) {
                i18n.changeLanguage(savedLang);
                setSelectedLang(savedLang);
            }
        };
        loadLang();
    }, []);

    // change and save language
    const handleLanguageSelect = async (lang: string) => {
        console.log('🌐 Changing language to:', lang);
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem(LANG_KEY, lang);
        setSelectedLang(lang);
        console.log('✅ Language changed successfully to:', lang);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <Modal visible={isVisible} transparent animationType="none" onRequestClose={onClose}>
            <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                <Pressable style={styles.overlayPressable} onPress={onClose} />

                <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Выбор языка</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Feather name="x" size={24} color="#666666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                        {languages.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.langItem,
                                    selectedLang === lang.code && styles.langItemSelected,
                                ]}
                                onPress={() => handleLanguageSelect(lang.code)}
                            >
                                <View style={styles.langContent}>
                                    <View style={styles.flagCircle}>
                                        <Text style={styles.flagEmoji}>{lang.flag}</Text>
                                    </View>
                                    <View style={styles.langInfo}>
                                        <Text style={styles.langLabel}>{lang.label}</Text>
                                        <Text style={styles.langNative}>{lang.native}</Text>
                                    </View>
                                </View>

                                {selectedLang === lang.code && (
                                    <View style={styles.checkCircle}>
                                        <Feather name="check" size={18} color="#20BDFF" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    overlayPressable: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "60%",
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1A1A1A",
    },
    closeButton: {
        padding: 4,
    },
    modalScroll: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    langItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        marginVertical: 6,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    langItemSelected: {
        backgroundColor: "#E6F7FF",
        borderColor: "#20BDFF",
        borderWidth: 2,
    },
    langContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        flex: 1,
    },
    flagCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
    },
    flagEmoji: {
        fontSize: 24,
    },
    langInfo: {
        flexDirection: "column",
        flex: 1,
    },
    langLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1A1A1A",
        marginBottom: 2,
    },
    langNative: {
        fontSize: 14,
        color: "#666666",
    },
    checkCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
});
