import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton, Paper, CircularProgress } from '@mui/material';
import { InsertDriveFile, PictureAsPdf, Description, TableChart, CloudUpload, Delete, Download, Email } from '@mui/icons-material';
import api from '../../lib/api';

interface DocumentManagerProps {
    entityId?: string;
    entityType: string;
    allowUpload?: boolean;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ entityId, entityType, allowUpload = true }) => {
    const [documents, setDocuments] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (entityId) {
            fetchDocuments();
        }
    }, [entityId, entityType]);

    const fetchDocuments = async () => {
        try {
            const res = await api.get(`/documents/list/${entityType}/${entityId}`);
            setDocuments(res.data);
        } catch (error) {
            console.error("Failed to list docs", error);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files[0] || !entityId) return;

        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityId', entityId);
        formData.append('entityType', entityType);

        setUploading(true);
        try {
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchDocuments();
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (id: string, name: string) => {
        try {
            const response = await api.get(`/documents/download/${id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/documents/${id}`);
            fetchDocuments();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleSendEmail = async (doc: any) => {
        const email = prompt("Enter recipient email:");
        if (email) {
            try {
                await api.post('/documents/send-email', {
                    recipient: email,
                    attachmentIds: [doc.id]
                });
                alert("Email queued!");
            } catch (error) {
                console.error("Email failed", error);
            }
        }
    };

    const getIcon = (mime: string) => {
        if (mime.includes('pdf')) return <PictureAsPdf color="error" />;
        if (mime.includes('sheet') || mime.includes('excel')) return <TableChart color="success" />;
        if (mime.includes('word') || mime.includes('document')) return <Description color="primary" />;
        return <InsertDriveFile color="action" />;
    };

    if (!entityId) return null; // Don't show if no entity selected yet

    return (
        <Paper sx={{ p: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Attachments</Typography>
                {allowUpload && (
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                        disabled={uploading}
                    >
                        Upload
                        <input type="file" hidden onChange={handleUpload} />
                    </Button>
                )}
            </Box>

            <List>
                {documents.map((doc) => (
                    <ListItem key={doc.id} sx={{ bgcolor: 'background.default', mb: 1, borderRadius: 1 }}>
                        <ListItemIcon>{getIcon(doc.mimeType)}</ListItemIcon>
                        <ListItemText
                            primary={doc.originalName}
                            secondary={`${(doc.size / 1024).toFixed(1)} KB • ${new Date(doc.createdAt).toLocaleDateString()}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleSendEmail(doc)} title="Email">
                                <Email />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleDownload(doc.id, doc.originalName)} title="Download">
                                <Download />
                            </IconButton>
                            {allowUpload && (
                                <IconButton edge="end" onClick={() => handleDelete(doc.id)} color="error" title="Delete">
                                    <Delete />
                                </IconButton>
                            )}
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
                {documents.length === 0 && (
                    <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                        No files attached.
                    </Typography>
                )}
            </List>
        </Paper>
    );
};
