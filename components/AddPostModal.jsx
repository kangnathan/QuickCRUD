'use client'
import { useState } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, Typography } from '@mui/material'
import { usePostContext } from '@/app/context/PostContext'  // Import the context
import styles from '@/app/styles/addpostmodal'

export default function AddPostModal({ open, onClose }) {  // Removed refetchPosts prop
    const { addPost, state: { loading, error } } = usePostContext()  // Use addPost from context
    const [formData, setFormData] = useState({ title: '', content: '' })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        const { title, content } = formData

        if (!title.trim() || !content.trim()) return

        await addPost(title, content)  // Call addPost instead of refetchPosts
        onClose()
        setFormData({ title: '', content: '' })
    }

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{ sx: styles.dialog }}
        >
            <DialogTitle>Add New Post</DialogTitle>
            <DialogContent>
                {error && <Typography color="error" gutterBottom>{error}</Typography>}
                <TextField
                    autoFocus
                    name="title"
                    placeholder="Title"
                    margin="dense"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.title}
                    onChange={handleChange}
                />
                <TextField
                    name="content"
                    margin="dense"
                    label="Write your thoughts..."
                    type="text"
                    fullWidth
                    multiline
                    minRows={4}
                    maxRows={10}
                    variant="outlined"
                    value={formData.content}
                    onChange={handleChange}
                    sx={styles.textFieldRoot}
                />
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose} 
                    disabled={loading} 
                    variant="outlined" 
                    sx={styles.cancelButton}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSave} 
                    disabled={loading || !formData.title.trim() || !formData.content.trim()}
                    variant="contained"
                    sx={styles.postButton}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
