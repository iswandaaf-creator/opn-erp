import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Typography
} from '@mui/material';
import {
    AttachFile as AttachFileIcon,
    Image as ImageIcon,
    VideoLibrary as VideoIcon,
    InsertDriveFile as FileIcon,
    Close as CloseIcon
} from '@mui/icons-material';

interface FilePickerProps {
    onFileSelected: (file: File) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ onFileSelected }) => {
    const [open, setOpen] = useState(false);

    const handleFileInput = (accept: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                onFileSelected(file);
                setOpen(false);
            }
        };
        input.click();
    };

    const fileTypes = [
        {
            icon: <ImageIcon color="success" />,
            title: 'Photos',
            subtitle: 'Share images',
            accept: 'image/*',
            color: '#4CAF50'
        },
        {
            icon: <VideoIcon color="info" />,
            title: 'Videos',
            subtitle: 'Share video files',
            accept: 'video/*',
            color: '#2196F3'
        },
        {
            icon: <FileIcon color="warning" />,
            title: 'Documents',
            subtitle: 'PDF, Word, Excel, etc.',
            accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt',
            color: '#FF9800'
        }
    ];

    return (
        <>
            <IconButton onClick={() => setOpen(true)} color="primary">
                <AttachFileIcon />
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Share File</Typography>
                        <IconButton onClick={() => setOpen(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {fileTypes.map((type, index) => (
                            <ListItemButton
                                key={index}
                                onClick={() => handleFileInput(type.accept)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    '&:hover': {
                                        bgcolor: `${type.color}10`
                                    }
                                }}
                            >
                                <ListItemIcon>{type.icon}</ListItemIcon>
                                <ListItemText
                                    primary={type.title}
                                    secondary={type.subtitle}
                                    primaryTypographyProps={{ fontWeight: 600 }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FilePicker;
