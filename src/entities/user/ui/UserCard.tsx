import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { User } from "../model/types/user";
import { FAQModal } from "../../faq/ui/FaqModal";
import { DocumentsModal } from "../../documents/ui/DocumentsModal";
import { LanguageModal } from "../../locale/ui/LanguageModal";

type UserCardProps = {
    profile: User;
}

export const UserCard: React.FC<UserCardProps> = ({ profile }) => {
    const router = useRouter();
    const [showFAQ, setShowFAQ] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
    const [langVisible, setLangVisible] = useState(false);

    const handleEditProfile = () => {
        router.push('/(auth)/login');
    };

    const handleLogout = async () => {
        Alert.alert(
            'Выйти',
            'Вы уверены, что хотите выйти из аккаунта?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Выйти',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            router.push('/(auth)/login');
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Удалить аккаунт',
            'Это действие необратимо. Все ваши данные будут удалены без возможности восстановления.',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: () => {
                        Alert.prompt(
                            'Подтверждение',
                            'Введите ваш пароль для подтверждения удаления аккаунта',
                            async (password) => {
                                if (password) {
                                    try {
                                        Alert.alert('Успешно', 'Аккаунт удален', [
                                            { text: 'OK', onPress: () => router.replace('/(auth)/login') },
                                        ]);
                                    } catch (error: any) {
                                        console.error('Delete account error:', error);
                                        Alert.alert(
                                            'Ошибка',
                                            error.response?.data?.message || 'Не удалось удалить аккаунт'
                                        );
                                    }
                                }
                            },
                            'secure-text'
                        );
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                <Feather name="log-out" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.nameContainer}>
                <Text style={styles.name}>{profile.first_name}{'\n'}{profile.last_name}</Text>
            </View>
            <TouchableOpacity style={styles.row} onPress={handleEditProfile}>
                <Feather name="user" size={24} color="black" />
                <Text style={styles.rowTitle}>Изменить личные данные</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => setLangVisible(true)}>
                <Feather name="globe" size={24} color="black" />
                <View>
                    <Text style={styles.rowTitle}>Язык приложения</Text>
                    <Text style={styles.rowSubtitle}>Текущий язык: русский</Text>
                </View>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={handleEditProfile}>
                <Feather name="award" size={24} color="black" />
                <Text style={styles.rowTitle}>Сертификаты</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={handleEditProfile}>
                <Feather name="navigation" size={24} color="black" />
                <Text style={styles.rowTitle}>Мой путь в обучении</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => setShowDocuments(true)}>
                <Feather name="book-open" size={24} color="black" />
                <Text style={styles.rowTitle}>Документы</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => setShowFAQ(true)}>
                <Feather name="message-circle" size={24} color="black" />
                <Text style={styles.rowTitle}>FAQ</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>

            <View style={styles.dangerZone}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.deleteButtonText}>Удалить аккаунт</Text>
                </TouchableOpacity>
            </View>

            <FAQModal visible={showFAQ} onClose={() => setShowFAQ(false)} />
            <DocumentsModal visible={showDocuments} onClose={() => setShowDocuments(false)} />
            <LanguageModal visible={langVisible} onClose={() => setLangVisible(false)} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    nameContainer: {
        paddingVertical: 60,
    },
    name: {
        fontSize: 30,
        fontWeight: "600",
        textAlign: "center",
        textTransform: "uppercase"
    },
    row: {
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#ddd",
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        marginHorizontal: 24,
    },
    rowTitle: {
        fontSize: 16,
        color: "#111",
        fontWeight: "500",
    },
    rowSubtitle: {
        fontSize: 13,
        color: "#919191",
        fontWeight: "500",
    },
    chevron: {
        marginLeft: "auto",
    },
    dangerZone: {
        marginTop: 60,
        flex: 1,
        alignItems: 'center',
    },
    deleteButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    deleteButtonText: {
        fontSize: 16,
        color: "#EF4444",
        fontWeight: "500",
        textAlign: "center"
    },
    logout: {
        position: "absolute",
        right: 30,
        top: 20,
    },
});
