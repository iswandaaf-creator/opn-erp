import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, TextField, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import { Add, Delete, Save } from '@mui/icons-material';
// import { DatePicker } from '@mui/x-date-pickers'; // Assuming DatePicker is available or use native

interface Item {
    productId?: string; // Future: Select from Inventory
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface SalesDocumentFormProps {
    title: string;
    type: 'quote' | 'order' | 'invoice';
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
}

export const SalesDocumentForm: React.FC<SalesDocumentFormProps> = ({ title, type, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        date: new Date().toISOString().slice(0, 10),
        dueDate: '',
        ...initialData
    });

    const [items, setItems] = useState<Item[]>([
        { description: '', quantity: 1, unitPrice: 0, total: 0 }
    ]);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.items) setItems(initialData.items);
        }
    }, [initialData]);

    const handleItemChange = (index: number, field: keyof Item, value: any) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;

        // Auto-calc total
        if (field === 'quantity' || field === 'unitPrice') {
            newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
        }
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unitPrice: 0, total: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.total, 0);
    };

    const handleSubmit = () => {
        onSubmit({
            ...formData,
            items,
            totalAmount: calculateTotal(),
            // Map specific fields based on type
            validUntil: type === 'quote' ? formData.date : undefined,
            orderDate: type === 'order' ? formData.date : undefined,
            invoiceDate: type === 'invoice' ? formData.date : undefined,
        });
    };

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>{title}</Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth label="Customer Name"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                        fullWidth label="Date" type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                {type === 'invoice' && (
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth label="Due Date" type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                )}
            </Grid>

            {/* Items Table */}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Description</TableCell>
                        <TableCell width={100}>Qty</TableCell>
                        <TableCell width={150}>Unit Price</TableCell>
                        <TableCell width={150}>Total</TableCell>
                        <TableCell width={50}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <TextField
                                    fullWidth size="small" placeholder="Item Name / Desc"
                                    value={item.description}
                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    fullWidth size="small" type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    fullWidth size="small" type="number"
                                    value={item.unitPrice}
                                    onChange={(e) => handleItemChange(index, 'unitPrice', Number(e.target.value))}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight="bold">${item.total.toLocaleString()}</Typography>
                            </TableCell>
                            <TableCell>
                                <IconButton color="error" onClick={() => removeItem(index)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box sx={{ mt: 2 }}>
                <Button startIcon={<Add />} onClick={addItem}>Add Item</Button>
            </Box>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ mr: 3 }}>Total: ${calculateTotal().toLocaleString()}</Typography>
                <Button variant="contained" size="large" startIcon={<Save />} onClick={handleSubmit}>
                    Save Document
                </Button>
            </Box>
        </Paper>
    );
};
