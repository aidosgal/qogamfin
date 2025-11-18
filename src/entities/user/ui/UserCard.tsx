import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { User } from "../model/types/user";
import { FAQModal } from "../../faq/ui/FaqModal";
import { DocumentsModal } from "../../documents/ui/DocumentsModal";
import { LanguageModal } from "../../locale/ui/LanguageModal";
import { EditProfileModal } from "./EditProfileModal";
import { useTranslation } from "react-i18next";

type UserCardProps = {
    profile: User;
    onProfileUpdate?: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ profile, onProfileUpdate }) => {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [showFAQ, setShowFAQ] = useState(false);
    const [showDocuments, setShowDocuments] = useState(false);
    const [langVisible, setLangVisible] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);

    // Split name into first and last name if needed
    const nameParts = profile.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const handleLogout = async () => {
        Alert.alert(
            t('profile.logout_confirm_title'),
            t('profile.logout_confirm_message'),
            [
                { text: t('profile.cancel'), style: 'cancel' },
                {
                    text: t('profile.logout'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            router.push('/(auth)/login');
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert(t('profile.error'), t('profile.logout_error'));
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            t('profile.delete_confirm_title'),
            t('profile.delete_confirm_message'),
            [
                { text: t('profile.cancel'), style: 'cancel' },
                {
                    text: t('profile.delete'),
                    style: 'destructive',
                    onPress: () => {
                        Alert.prompt(
                            t('profile.delete_confirm_title'),
                            t('profile.delete_password_prompt'),
                            async (password) => {
                                if (password) {
                                    try {
                                        Alert.alert(t('profile.success'), t('profile.delete_success'), [
                                            { text: t('profile.ok'), onPress: () => router.replace('/(auth)/login') },
                                        ]);
                                    } catch (error: any) {
                                        console.error('Delete account error:', error);
                                        Alert.alert(
                                            t('profile.error'),
                                            error.response?.data?.message || t('profile.delete_error')
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
                <Text style={styles.name}>{firstName}{lastName ? '\n' + lastName : ''}</Text>
            </View>
            <TouchableOpacity style={styles.row} onPress={() => setShowEditProfile(true)}>
                <Feather name="user" size={24} color="black" />
                <Text style={styles.rowTitle}>{t('profile.edit_profile')}</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => setLangVisible(true)}>
                <Feather name="globe" size={24} color="black" />
                <View>
                    <Text style={styles.rowTitle}>{t('profile.language')}</Text>
                    <Text style={styles.rowSubtitle}>{t('profile.current_language')}: {i18n.language === 'ru' ? t('profile.language_russian') : t('profile.language_kazakh')}</Text>
                </View>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => router.push('/certificates')}>
                <Feather name="award" size={24} color="black" />
                <Text style={styles.rowTitle}>{t('profile.certificates')}</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => {router.push('/(tabs)/courses')}}>
                <Feather name="navigation" size={24} color="black" />
                <Text style={styles.rowTitle}>{t('profile.my_path')}</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => setShowDocuments(true)}>
                <Feather name="book-open" size={24} color="black" />
                <Text style={styles.rowTitle}>{t('profile.documents')}</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => setShowFAQ(true)}>
                <Feather name="message-circle" size={24} color="black" />
                <Text style={styles.rowTitle}>{t('profile.faq')}</Text>
                <Feather name="chevron-right" size={24} color="black" style={styles.chevron} />
            </TouchableOpacity>

            <View style={styles.dangerZone}>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteAccount}
                >
                    <Text style={styles.deleteButtonText}>{t('profile.delete_account')}</Text>
                </TouchableOpacity>
            </View>

            <EditProfileModal 
                visible={showEditProfile} 
                onClose={() => setShowEditProfile(false)}
                onUpdate={onProfileUpdate}
            />
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
