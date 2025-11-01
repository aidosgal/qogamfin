import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, Animated, Pressable } from "react-native";
import Feather from '@expo/vector-icons/Feather';

type DocumentsModalProps = {
    visible: boolean;
    onClose: () => void;
}

export const DocumentsModal: React.FC<DocumentsModalProps> = ({ visible, onClose }) => {
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
                        <Text style={styles.modalTitle}>Документы</Text>
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
                        <View style={styles.documentCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconCircle}>
                                    <Feather name="shield" size={20} color="#20BDFF" />
                                </View>
                                <Text style={styles.documentTitle}>Политика конфиденциальности</Text>
                            </View>
                            
                            <Text style={styles.documentText}>
                                Настоящая Политика конфиденциальности описывает, как мы собираем, используем и защищаем вашу личную информацию при использовании нашего приложения.
                            </Text>
                            
                            <View style={styles.section}>
                                <Text style={styles.documentSubtitle}>Сбор информации</Text>
                                <Text style={styles.documentText}>
                                    Мы собираем информацию, которую вы предоставляете при регистрации и использовании приложения, включая имя, дату рождения, контактные данные и информацию о членах семьи.
                                </Text>
                            </View>
                            
                            <View style={styles.section}>
                                <Text style={styles.documentSubtitle}>Использование данных</Text>
                                <Text style={styles.documentText}>
                                    Ваши данные используются исключительно для подбора подходящих государственных программ поддержки. Мы не продаем и не передаем ваши данные третьим лицам без вашего согласия.
                                </Text>
                            </View>
                            
                            <View style={styles.section}>
                                <Text style={styles.documentSubtitle}>Защита информации</Text>
                                <Text style={styles.documentText}>
                                    Мы применяем современные методы шифрования и защиты данных для обеспечения безопасности вашей личной информации.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.documentCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconCircle}>
                                    <Feather name="file-text" size={20} color="#20BDFF" />
                                </View>
                                <Text style={styles.documentTitle}>Пользовательское соглашение</Text>
                            </View>
                            
                            <Text style={styles.documentText}>
                                Используя это приложение, вы соглашаетесь с условиями данного соглашения.
                            </Text>
                            
                            <View style={styles.section}>
                                <Text style={styles.documentSubtitle}>Условия использования</Text>
                                <Text style={styles.documentText}>
                                    Приложение предоставляет информацию о государственных программах поддержки в Республике Казахстан. Мы прилагаем все усилия для обеспечения точности информации, но не несем ответственности за возможные изменения в условиях программ.
                                </Text>
                            </View>
                            
                            <View style={styles.section}>
                                <Text style={styles.documentSubtitle}>Ответственность пользователя</Text>
                                <Text style={styles.documentText}>
                                    Пользователь обязуется предоставлять достоверную информацию и использовать приложение в законных целях. Любое использование приложения для мошенничества или получения выплат путем предоставления ложных данных запрещено.
                                </Text>
                            </View>
                            
                            <View style={styles.section}>
                                <Text style={styles.documentSubtitle}>Изменения в соглашении</Text>
                                <Text style={styles.documentText}>
                                    Мы оставляем за собой право вносить изменения в данное соглашение. О существенных изменениях пользователи будут уведомлены через приложение.
                                </Text>
                            </View>
                        </View>
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
    documentCard: {
        marginTop: 20,
        padding: 20,
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
        marginBottom: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E6F7FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    documentTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
    },
    section: {
        marginTop: 16,
    },
    documentSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    documentText: {
        fontSize: 15,
        color: '#666666',
        lineHeight: 22,
    },
});
