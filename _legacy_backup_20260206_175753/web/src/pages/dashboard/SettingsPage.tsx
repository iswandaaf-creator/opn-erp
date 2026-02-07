import { Typography, Box, Card, CardContent } from '@mui/material';

export const SettingsPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <Card>
                <CardContent>
                    <Typography color="textSecondary">
                        System Configuration and User Profiles.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};
