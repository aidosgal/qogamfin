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
            question: "Как объявить себя банкротом?",
            answer: "Для объявления банкротства необходимо обратиться в суд или использовать процедуру внесудебного банкротства, в зависимости от суммы задолженности."
        },
        {
            question: "Какая сумма долга допускает банкротство?",
            answer: "Внесудебное банкротство: долг до 1600 МРП (до 6 291 200 тенге в 2025 году), не погашенный в течение 12 месяцев. Судебное банкротство: долг свыше 1600 МРП."
        },
        {
            question: "Какие долги не списываются?",
            answer: "Не списываются алименты, штрафы, долги по возмещению вреда жизни и здоровью, а также некоторые другие виды обязательств."
        },
        {
            question: "Повлияет ли банкротство на родственников?",
            answer: "Нет, банкротство распространяется только на должника и не влияет на финансовые обязательства родственников."
        },
        {
            question: "Что проверяют при банкротстве?",
            answer: "При банкротстве проверяют все активы должника, финансовые операции за последние несколько лет, а также наличие признаков фиктивного банкротства."
        },
        {
            question: "Каковы последствия банкротства?",
            answer: "После банкротства вы будете иметь ограничения на получение кредитов, занятие определенных должностей и совершение крупных сделок в течение установленного срока."
        },
        {
            question: "Как получить новый график погашения?",
            answer: "Обратитесь в банк с заявлением о реструктуризации задолженности. Предоставьте документы, подтверждающие ваше финансовое положение."
        },
        {
            question: "Что делать, если не можешь платить кредит?",
            answer: "Немедленно свяжитесь с банком и объясните ситуацию. Можно запросить отсрочку платежа, реструктуризацию или рефинансирование кредита."
        },
        {
            question: "Как получить отсрочку по кредиту?",
            answer: "Подайте заявление в банк с просьбой об отсрочке, приложите документы, подтверждающие тяжелое финансовое положение (справка о доходах, документы о потере работы и др.)."
        },
        {
            question: "Как снять арест со счета?",
            answer: "Погасите задолженность или обратитесь в суд с ходатайством об отмене ареста. Также можно договориться с взыскателем о снятии ареста."
        },
        {
            question: "Как снять арест от ЧСИ?",
            answer: "Погасите долг перед взыскателем, после чего частный судебный исполнитель обязан снять арест в течение установленного законом срока."
        },
        {
            question: "Что делать, если ЧСИ не снимает арест?",
            answer: "Подайте жалобу в Министерство юстиции РК или обратитесь в суд с заявлением о незаконных действиях частного судебного исполнителя."
        },
        {
            question: "Куда обращаться, если вы были обмануты мошенниками?",
            answer: "Обратитесь в полицию для подачи заявления о мошенничестве. Также можно обратиться в прокуратуру или к адвокату для защиты своих прав."
        },
        {
            question: "Как возбудить дело о мошенничестве?",
            answer: "Подайте заявление в полицию с подробным описанием обстоятельств мошенничества и приложите все имеющиеся доказательства (переписку, квитанции, договоры)."
        },
        {
            question: "Как доказать мошенничество?",
            answer: "Соберите все доказательства: переписку, записи разговоров, платежные документы, свидетельские показания. Обратитесь к адвокату для правильного оформления доказательной базы."
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
