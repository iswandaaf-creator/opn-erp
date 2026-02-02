import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Title, HelperText } from 'react-native-paper';
import { login } from '../services/auth';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        <View style={styles.container}>
            <Title style={styles.title}>ACG ERP Mobile</Title>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                mode="outlined"
                style={styles.input}
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
            >
                Login
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: 40,
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        padding: 5,
    },
});
