import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";

import i18n, { initLanguage } from '../shared/i18n/i18n';
import { I18nextProvider } from 'react-i18next';

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const [ready, setReady] = useState(false);

    const customTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: "white",
        }
    }

    useEffect(() => {
        const setup = async () => {
            await initLanguage();
            setReady(true);
        };
        setup();
    }, []);

    if (!ready) {
        // show loading spinner while initializing language
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeProvider value={customTheme}>
            <I18nextProvider i18n={i18n}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="modal"
                        options={{ presentation: 'modal', title: 'Modal' }}
                    />
                </Stack>
                <StatusBar style="auto" />
            </I18nextProvider>
        </ThemeProvider>
    );
}
