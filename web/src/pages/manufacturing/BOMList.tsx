import { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    MenuItem, Grid
} from '@mui/material';
import { Add as AddIcon, Visibility } from '@mui/icons-material';
import api from '../../lib/api';

export const BOMList = () => {
    const [boms, setBoms] = useState([]);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);

    // Form State
    const [newBOM, setNewBOM] = useState({
        name: '',
        productId: '',
        description: '',
        bomLines: [] as any[] // { materialId: '', quantity: 0 }
    });

    useEffect(() => {
        fetchBOMs();
        fetchProducts();
    }, []);

    const fetchBOMs = async () => {
        try {
            const res = await api.get('/manufacturing/boms');
            setBoms(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            await api.post('/manufacturing/boms', newBOM);
            setOpen(false);
            fetchBOMs();
        } catch (error) {
            alert('Failed to save BOM');
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Bill of Materials</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Create BOM
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>BOM Name</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Components</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {boms.map((bom: any) => (
                            <TableRow key={bom.id}>
                                <TableCell>{bom.name}</TableCell>
                                <TableCell>{bom.product?.name}</TableCell>
                                <TableCell>{bom.bomLines?.length || 0} items</TableCell>
                                <TableCell>
                                    <Chip label={bom.isActive ? 'Active' : 'Inactive'} color={bom.isActive ? 'success' : 'default'} size="small" />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small"><Visibility /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {boms.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No BOMs found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New BOM</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="BOM Name"
                            fullWidth
                            value={newBOM.name}
                            onChange={(e) => setNewBOM({ ...newBOM, name: e.target.value })}
                        />
                        <TextField
                            select
                            label="For Product"
                            fullWidth
                            value={newBOM.productId}
                            onChange={(e) => setNewBOM({ ...newBOM, productId: e.target.value })}
                        >
                            {products.map((p: any) => (
                                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                            ))}
                        </TextField>
                        <Typography variant="caption">
                            * Component selection would go here (Simplified for MVP)
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
