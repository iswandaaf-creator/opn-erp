import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Layout, Text, Input, Button, Card, Spinner } from '@ui-kitten/components';
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
            // HARDCODED OWNER LOGIN (Requested by User)
            if (email === 'iswanda.af@gmail.com' && password === '112233') {
                const mockOwner = {
                    id: 'owner-1',
                    email: 'iswanda.af@gmail.com',
                    name: 'Iswanda AF',
                    role: 'OWNER'
                };

                // Manually save mock session
                const SecureStore = require('expo-secure-store');
                await SecureStore.setItemAsync('token', 'mock-owner-token-mobile');
                await SecureStore.setItemAsync('user', JSON.stringify(mockOwner));

                navigation.replace('Dashboard');
                return;
            }

            await login(email, password);
            navigation.replace('Dashboard');
        } catch (err) {
            setError('Invalid credentials or connection error');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const renderPasswordIcon = (props) => (
        <Button
            appearance='ghost'
            size='small'
            onPress={() => setSecureTextEntry(!secureTextEntry)}
        >
            {secureTextEntry ? '👁️' : '🙈'}
        </Button>
    );

    return (
        <Layout style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Date Display */}
                <Text category='c1' appearance='hint' style={styles.dateText}>
                    {dateString}
                </Text>

                <Card style={styles.card} status='primary'>
                    <View style={styles.header}>
                        <Text category='h1' style={styles.title}>
                            Open Erp
                        </Text>
                        <Text category='s1' appearance='hint'>
                            Sign in to continue
                        </Text>
                    </View>

                    <Input
                        label='Email'
                        placeholder='Enter your email'
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize='none'
                        keyboardType='email-address'
                        style={styles.input}
                        size='large'
                    />

                    <Input
                        label='Password'
                        placeholder='Enter your password'
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secureTextEntry}
                        accessoryRight={renderPasswordIcon}
                        style={styles.input}
                        size='large'
                    />

                    {error ? (
                        <Text status='danger' style={styles.errorText}>
                            {error}
                        </Text>
                    ) : null}

                    <Button
                        style={styles.button}
                        size='large'
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? <Spinner size='small' status='control' /> : 'Sign In'}
                    </Button>
                </Card>

                <Text appearance='hint' style={styles.footer}>
                    © 2026 Open Erp
                </Text>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    dateText: {
        textAlign: 'center',
        marginBottom: 24,
    },
    card: {
        borderRadius: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    title: {
        marginBottom: 8,
    },
    input: {
        marginBottom: 16,
    },
    errorText: {
        marginBottom: 16,
        textAlign: 'center',
    },
    button: {
        marginTop: 16,
        borderRadius: 8,
    },
    footer: {
        textAlign: 'center',
        marginTop: 32,
    },
});
