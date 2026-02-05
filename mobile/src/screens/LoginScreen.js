import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../services/auth';

export default function LoginScreen({ navigation }) {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigation.replace('Dashboard');
        } catch (err) {
            setError('Invalid credentials or connection error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Surface style={[styles.surface, { backgroundColor: colors.surface }]} elevation={4}>
                    <View style={styles.headerContainer}>
                        <Image
                            source={require('../../assets/icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text variant="headlineMedium" style={{ color: colors.primary, fontWeight: 'bold', marginTop: 16, textAlign: 'center' }}>
                            Open Erp
                        </Text>
                        <Text variant="bodyMedium" style={{ color: colors.onSurface, textAlign: 'center', opacity: 0.7 }}>
                            Sign in to continue
                        </Text>
                    </View>

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        style={styles.input}
                        contentStyle={{ backgroundColor: colors.surface }}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secureTextEntry}
                        mode="outlined"
                        right={<TextInput.Icon icon={secureTextEntry ? "eye" : "eye-off"} onPress={() => setSecureTextEntry(!secureTextEntry)} forceTextInputFocus={false} />}
                        style={styles.input}
                        contentStyle={{ backgroundColor: colors.surface }}
                    />

                    <HelperText type="error" visible={!!error}>
                        {error}
                    </HelperText>

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        style={styles.button}
                        contentStyle={{ paddingVertical: 6 }}
                    >
                        Login
                    </Button>
                </Surface>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    surface: {
        padding: 30,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
    },
});
