import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { TextInput, Button, Text, HelperText, Card } from 'react-native-paper';
import { login } from '../services/auth';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigation.replace('Dashboard');
        } catch (err) {
            setError('Invalid credentials or connection error');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Card style={styles.card} elevation={4}>
                    <Card.Content>
                        <View style={styles.header}>
                            <Text variant="displaySmall" style={styles.title}>
                                Open Erp
                            </Text>
                            <Text variant="bodyMedium" style={styles.subtitle}>
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
                        />

                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={secureTextEntry}
                            mode="outlined"
                            right={
                                <TextInput.Icon
                                    icon={secureTextEntry ? "eye" : "eye-off"}
                                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                                />
                            }
                            style={styles.input}
                        />

                        {error ? (
                            <HelperText type="error" visible={true}>
                                {error}
                            </HelperText>
                        ) : null}

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={loading}
                            style={styles.button}
                            contentStyle={styles.buttonContent}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </Card.Content>
                </Card>

                <Text style={styles.footer}>© 2026 Open Erp</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingTop: 60,
    },
    card: {
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    title: {
        fontWeight: 'bold',
        color: '#1976D2',
    },
    subtitle: {
        color: '#666666',
        marginTop: 8,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    button: {
        marginTop: 8,
        borderRadius: 8,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    footer: {
        textAlign: 'center',
        marginTop: 32,
        color: '#999999',
    },
});
