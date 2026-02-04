import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SalesDocumentForm } from '../../components/sales/SalesDocumentForm';
import api from '../../lib/api';

export const CreateSalesQuotation = () => {
    const navigate = useNavigate();

    const handleSubmit = async (data: any) => {
        try {
            await api.post('/sales/quotations', data);
            navigate('/sales/quotations');
        } catch (error) {
            console.error("Failed to create quote", error);
            // Add toast here
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>
            <SalesDocumentForm
                title="Create Sales Quotation"
                type="quote"
                onSubmit={handleSubmit}
            />
        </Box>
    );
};
