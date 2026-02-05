import React from 'react';
import { View, StyleSheet, ScrollView, Linking } from 'react-native';
import { Layout, Text, Button, Card, Icon, Divider, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { TouchableOpacity } from 'react-native-gesture-handler';

const BackIcon = (props) => (
    <Icon {...props} name='arrow-back' />
);

const SupportScreen = ({ navigation }) => {
    const navigateBack = () => {
        navigation.goBack();
    };

    const BackAction = () => (
        <TopNavigationAction icon={BackIcon} onPress={navigateBack} />
    );

    const faqs = [
        {
            question: "How do I create a new order?",
            answer: "Go to the Dashboard and click on 'New Sales Order'. Select the items and customer, then click Save."
        },
        {
            question: "How to check inventory?",
            answer: "Navigate to the Inventory section from the main menu. You can see real-time stock levels there."
        },
        {
            question: "Can I print invoices?",
            answer: "Yes, open any Invoice and click the 'Print' or 'PDF' button at the top right corner."
        }
    ];

    const contactAdmin = () => {
        // Navigate to Chat with Admin (Assuming Admin ID is known or fixed, e.g., 'owner-1')
        // In real app, fetch admin ID dynamically
        navigation.navigate('Chat', {
            partnerId: 'owner-1',
            partnerName: 'Administrator'
        });
    };

    return (
        <Layout style={styles.container}>
            <TopNavigation
                title='Support Center'
                alignment='center'
                accessoryLeft={BackAction}
                style={styles.header}
            />
            <Divider />

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text category='h5' style={styles.sectionTitle}>Need Help?</Text>
                    <Text appearance='hint' style={styles.subtitle}>
                        Browse our FAQs or contact support directly.
                    </Text>
                </View>

                <View style={styles.actionContainer}>
                    <Button
                        style={styles.contactButton}
                        size='giant'
                        accessoryLeft={(props) => <Icon {...props} name='message-circle-outline' />}
                        onPress={contactAdmin}
                    >
                        Chat with Admin
                    </Button>
                </View>

                <Text category='h6' style={styles.faqHeader}>Frequently Asked Questions</Text>

                {faqs.map((faq, index) => (
                    <Card key={index} style={styles.faqCard}>
                        <Text category='s1' style={styles.question}>{faq.question}</Text>
                        <Text category='p2' appearance='hint' style={styles.answer}>{faq.answer}</Text>
                    </Card>
                ))}

                <View style={styles.footer}>
                    <Text category='c1' appearance='hint'>App Version 2.2.0</Text>
                    <Text category='c1' appearance='hint'>Copyright © Open ERP</Text>
                </View>
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 20, // Check StatusBar height
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
        alignItems: 'center',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
    },
    actionContainer: {
        marginBottom: 32,
    },
    contactButton: {
        borderRadius: 12,
    },
    faqHeader: {
        marginBottom: 16,
    },
    faqCard: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E4E9F2',
        borderRadius: 8,
    },
    question: {
        marginBottom: 8,
        color: '#3366FF',
    },
    answer: {
        lineHeight: 20,
    },
    footer: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 32,
        gap: 4,
    }
});

export default SupportScreen;
