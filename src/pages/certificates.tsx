import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useAuth } from "../features/auth/model/useAuth";
import { Certificate } from "../entities/user/model/types/certificate";
import Feather from "@expo/vector-icons/Feather";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

const API_URL = "https://qogamfin.kz/api";

export const CertificatesScreen: React.FC = () => {
  const { state } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = async () => {
    if (!state.token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/my-application-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${state.token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch certificates");
      }

      // Extract certificate from the response
      if (result.certificate) {
        setCertificates([result.certificate]);
      } else {
        setCertificates([]);
      }
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch certificates:", err);
      setError(err.message || "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [state.token]);

  const handleDownloadCertificate = (certificate: Certificate) => {
    if (certificate.url) {
      Alert.alert(
        t("certificates.download_title"),
        t("certificates.download_message"),
        [
          { text: t("profile.cancel"), style: "cancel" },
          {
            text: t("certificates.download"),
            onPress: () => {
              // TODO: Implement download functionality
              console.log("Download certificate:", certificate.url);
            },
          },
        ]
      );
    }
  };

  const renderCertificateCard = ({ item }: { item: Certificate }) => (
    <TouchableOpacity
      style={styles.certificateCard}
      onPress={() => handleDownloadCertificate(item)}
    >
      <View style={styles.iconContainer}>
        <Feather name="award" size={40} color="#4F46E5" />
      </View>
      <View style={styles.certificateInfo}>
        <Text style={styles.certificateName}>{item.name}</Text>
        {item.course_name && (
          <Text style={styles.courseName}>{item.course_name}</Text>
        )}
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>
      <Feather name="download" size={24} color="#4F46E5" />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Feather name="award" size={64} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>{t("certificates.no_certificates")}</Text>
      <Text style={styles.emptyDescription}>
        {t("certificates.no_certificates_description")}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.customHeaderTitle}>{t("certificates.my_certificates")}</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>{t("profile.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.customHeaderTitle}>{t("certificates.my_certificates")}</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchCertificates}
          >
            <Text style={styles.retryButtonText}>{t("certificates.retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.customHeaderTitle}>{t("certificates.my_certificates")}</Text>
        <View style={styles.headerRight} />
      </View>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>
            {certificates.length} {t("certificates.certificates_count")}
          </Text>
        </View>
        <FlatList
          data={certificates}
          renderItem={renderCertificateCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={
            certificates.length === 0 ? styles.emptyList : styles.list
          }
          ListEmptyComponent={renderEmptyState}
          refreshing={loading}
          onRefresh={fetchCertificates}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
    width: 40,
  },
  customHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  certificateCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  courseName: {
    fontSize: 14,
    color: "#4F46E5",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
