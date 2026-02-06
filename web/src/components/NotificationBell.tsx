import React, { useEffect, useState } from 'react';
import { IconButton, Badge, Snackbar, Alert, Button } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { notificationService } from '../services/notificationService';

const NotificationBell: React.FC = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Initialize notification service
        notificationService.initialize().then(() => {
            setPermission(notificationService.getPermission());

            // Show prompt if permission not yet requested
            if (notificationService.getPermission() === 'default') {
                setTimeout(() => setShowPrompt(true), 3000);
            }
        });
    }, []);

    const handleRequestPermission = async () => {
        const result = await notificationService.requestPermission();
        setPermission(result);
        setShowPrompt(false);

        if (result === 'granted') {
            // Show welcome notification
            notificationService.showNotification('Notifications Enabled', {
                body: 'You will now receive updates from OpenERP',
                icon: '/logo192.png'
            });
        }
    };

    const handleTestNotification = () => {
        notificationService.showNotification('Test Notification', {
            body: 'This is a test notification from OpenERP',
            icon: '/logo192.png'
        });
    };

    if (!notificationService.isSupported()) {
        return null;
    }

    return (
        <>
            <IconButton
                color="inherit"
                onClick={permission === 'granted' ? handleTestNotification : handleRequestPermission}
                title={permission === 'granted' ? 'Test notification' : 'Enable notifications'}
                sx={{ mr: 2 }}
            >
                <Badge
                    color={permission === 'granted' ? 'success' : 'error'}
                    variant="dot"
                    invisible={permission === 'default'}
                >
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Snackbar
                open={showPrompt}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setShowPrompt(false)}
            >
                <Alert
                    severity="info"
                    variant="filled"
                    action={
                        <Button color="inherit" size="small" onClick={handleRequestPermission}>
                            Enable
                        </Button>
                    }
                >
                    Enable notifications to stay updated with messages and emails!
                </Alert>
            </Snackbar>
        </>
    );
};

export default NotificationBell;
