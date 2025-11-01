import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, Animated, Pressable } from "react-native";
import Feather from '@expo/vector-icons/Feather';

type FAQModalProps = {
    visible: boolean;
    onClose: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ visible, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(300))[0];

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
                })
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
                })
            ]).start(() => {
                setIsVisible(false);
            });
        }
    }, [visible]);

    const faqData = [
        {
            question: "Что такое это приложение?",
            answer: "Это мобильное приложение для поиска государственных программ поддержки и социальных выплат в Республике Казахстан. Мы помогаем семьям узнать, на какие виды помощи они имеют право."
        },
        {
            question: "Как работает поиск?",
            answer: "Вы заполняете информацию о своей семье и детях, а приложение автоматически подбирает все доступные программы поддержки, которые подходят именно вам."
        },
        {
            question: "Это бесплатно?",
            answer: "Да, приложение полностью бесплатное. Мы не берем комиссий и не требуем оплаты за предоставление информации."
        },
        {
            question: "Безопасны ли мои данные?",
            answer: "Ваши персональные данные надежно защищены и используются только для подбора подходящих программ. Мы не передаем информацию третьим лицам."
        },
        {
            question: "Можно ли подать заявку через приложение?",
            answer: "Приложение предоставляет информацию о программах и ссылки на официальные источники, где вы можете подать заявку."
        },
    ];

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View 
                style={[
                    styles.modalOverlay,
                    { opacity: fadeAnim }
                ]}
            >
                <Pressable 
                    style={styles.overlayPressable}
                    onPress={onClose}
                />
                <Animated.View 
                    style={[
                        styles.modalContent,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Часто задаваемые вопросы</Text>
                        <TouchableOpacity 
                            onPress={onClose}
                            style={styles.closeButton}
                        >
                            <Feather name="x" size={24} color="#666666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        style={styles.modalScroll}
                        showsVerticalScrollIndicator={false}
                    >
                        {faqData.map((item, index) => (
                            <View key={index} style={styles.faqItem}>
                                <View style={styles.questionContainer}>
                                    <View style={styles.iconCircle}>
                                        <Feather name="help-circle" size={18} color="#20BDFF" />
                                    </View>
                                    <Text style={styles.question}>{item.question}</Text>
                                </View>
                                <Text style={styles.answer}>{item.answer}</Text>
                            </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    overlayPressable: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    closeButton: {
        padding: 4,
    },
    modalScroll: {
        paddingHorizontal: 20,
    },
    faqItem: {
        marginTop: 20,
        padding: 18,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    questionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E6F7FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        flex: 1,
        lineHeight: 22,
    },
    answer: {
        fontSize: 15,
        color: '#666666',
        lineHeight: 22,
        marginLeft: 44,
    },
});
