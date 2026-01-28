import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
    DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import api from '../../lib/api';

export const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', position: '', email: '', phone: '', salary: '' });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const res = await api.get('/employees');
        setEmployees(res.data);
    };

    const handleSave = async () => {
        await api.post('/employees', { ...formData, salary: Number(formData.salary), joinDate: new Date().toISOString() });
        setOpen(false);
        fetchEmployees();
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Employees</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Employee</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell align="right">Salary</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees.map((emp: any) => (
                            <TableRow key={emp.id}>
                                <TableCell>{emp.fullName}</TableCell>
                                <TableCell><Chip label={emp.position} size="small" /></TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>{emp.phone}</TableCell>
                                <TableCell align="right">${Number(emp.salary).toLocaleString()}</TableCell>
                                <TableCell align="center">
                                    <IconButton size="small"><EditIcon /></IconButton>
                                    <IconButton size="small" color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>New Employee</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
                        <TextField label="Full Name" fullWidth value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                        <TextField label="Position" fullWidth value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                        <TextField label="Email" fullWidth value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        <TextField label="Phone" fullWidth value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        <TextField label="Salary" type="number" fullWidth value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
