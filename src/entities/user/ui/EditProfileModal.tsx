import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Animated,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "../../../features/auth/model/useAuth";
import { userApi } from "../model/api/userApi";
import { User } from "../model/types/user";

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
  onUpdate?: () => void;
};

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  onUpdate,
}) => {
  const { state } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(300))[0];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [iin, setIin] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

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

      // Fetch user info when modal opens
      fetchUserInfo();
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
      ]).start(() => {
        setIsVisible(false);
      });
    }
  }, [visible]);

  const fetchUserInfo = async () => {
    if (!state.token) {
      onClose();
      return;
    }

    try {
      setLoading(true);
      const userInfo = await userApi.getUserInfo(state.token);
      setUser(userInfo);

      // Populate form fields
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
      setIin(userInfo.iin || "");
      setBirthday(userInfo.birthday || "");
    } catch (err: any) {
      console.error("Failed to fetch user info:", err);
      Alert.alert("Ошибка", "Не удалось загрузить данные профиля");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!state.token || !user) return;

    if (!name.trim()) {
      Alert.alert("Ошибка", "Введите имя");
      return;
    }

    // Validate password if provided
    if (password && password !== passwordConfirmation) {
      Alert.alert("Ошибка", "Пароли не совпадают");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        name: name.trim(),
        email: email.trim() || null,
        iin: iin.trim() || null,
        region_id: 12,
        district_id: 15,
        birthday: birthday.trim() || null,
        password: password || "",
        password_confirmation: password ? passwordConfirmation : null,
      };

      await userApi.updateUserInfo(state.token, user.id, updateData);

      Alert.alert("Успешно", "Профиль обновлен");
      onUpdate?.();
      onClose();
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      Alert.alert("Ошибка", err.message || "Не удалось обновить профиль");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="none">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Pressable style={styles.overlayPressable} onPress={onClose} />
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Редактировать профиль</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <>
                <ScrollView
                  style={styles.modalScroll}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.form}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Имя *</Text>
                      <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Введите имя"
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Email</Text>
                      <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Введите email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>ИИН</Text>
                      <TextInput
                        style={styles.input}
                        value={iin}
                        onChangeText={setIin}
                        placeholder="Введите ИИН"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        maxLength={12}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Дата рождения</Text>
                      <TextInput
                        style={styles.input}
                        value={birthday}
                        onChangeText={setBirthday}
                        placeholder="ГГГГ-ММ-ДД"
                        placeholderTextColor="#999"
                      />
                    </View>

                    <View style={styles.separator} />

                    <Text style={styles.sectionTitle}>
                      Изменить пароль (опционально)
                    </Text>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Новый пароль</Text>
                      <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Введите новый пароль"
                        placeholderTextColor="#999"
                        secureTextEntry
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Подтверждение пароля</Text>
                      <TextInput
                        style={styles.input}
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                        placeholder="Подтвердите пароль"
                        placeholderTextColor="#999"
                        secureTextEntry
                      />
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      saving && styles.saveButtonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text style={styles.saveButtonText}>Сохранить</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
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
    maxHeight: "90%",
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
  loadingContainer: {
    padding: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  modalScroll: {
    maxHeight: "70%",
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111",
    backgroundColor: "#FFFFFF",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  saveButton: {
    backgroundColor: "#015FF9",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
