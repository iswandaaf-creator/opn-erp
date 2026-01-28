import { Typography, Box, Card, CardContent } from '@mui/material';

export const ApprovalsPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>Pending Approvals</Typography>
            <Card>
                <CardContent>
                    <Typography color="textSecondary">
                        Approvals Module Placeholder - POs and Requests will go here.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};
