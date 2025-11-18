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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "../features/auth/model/useAuth";
import { userApi } from "../entities/user/model/api/userApi";
import { User } from "../entities/user/model/types/user";

export default function EditProfileScreen() {
  const router = useRouter();
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [iin, setIin] = useState("");
  const [regionId, setRegionId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [locality, setLocality] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!state.token) {
        router.back();
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
        setRegionId(userInfo.region_id?.toString() || "");
        setDistrictId(userInfo.district_id?.toString() || "");
        setLocality(userInfo.locality || "");
        setBirthday(userInfo.birthday || "");
      } catch (err: any) {
        console.error("Failed to fetch user info:", err);
        Alert.alert("Ошибка", "Не удалось загрузить данные профиля");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [state.token]);

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
        region_id: regionId ? parseInt(regionId) : user.region_id,
        district_id: districtId ? parseInt(districtId) : user.district_id,
        locality: locality.trim() || null,
        birthday: birthday.trim() || null,
        password: password || "",
        password_confirmation: password ? passwordConfirmation : null,
      };

      await userApi.updateUserInfo(state.token, user.id, updateData);
      
      Alert.alert("Успешно", "Профиль обновлен", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      Alert.alert("Ошибка", err.message || "Не удалось обновить профиль");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Редактировать профиль</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.label}>Регион ID</Text>
            <TextInput
              style={styles.input}
              value={regionId}
              onChangeText={setRegionId}
              placeholder="Введите ID региона"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Район ID</Text>
            <TextInput
              style={styles.input}
              value={districtId}
              onChangeText={setDistrictId}
              placeholder="Введите ID района"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Населенный пункт</Text>
            <TextInput
              style={styles.input}
              value={locality}
              onChangeText={setLocality}
              placeholder="Введите населенный пункт"
              placeholderTextColor="#999"
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

          <Text style={styles.sectionTitle}>Изменить пароль (опционально)</Text>

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
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
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
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 16,
  },
  footer: {
    padding: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#111",
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
