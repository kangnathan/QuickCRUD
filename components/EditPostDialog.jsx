import React, { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogTitle, TextField, Box, Typography, Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import { formatDateTime } from '../utils/formatDateTime'
import DeletePostDialog from './DeletePostDialog'
import { usePostContext } from '../app/context/PostContext'
import styles from '@/app/styles/editpostdialog'

const EditPostDialog = ({ post, open, onClose }) => {
  const { state, dispatch } = usePostContext()
  const [editedPost, setEditedPost] = useState(post)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field) => (e) => {
    setEditedPost((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.put(`/api/currentUserPosts/${post.id}`, {
        title: editedPost.title,
        content: editedPost.content,
      })

      if (data.success) {
        const updatedPost = data.data
        dispatch({
          type: 'SET_POSTS',
          payload: state.posts.map((p) => (p.id === post.id ? { ...p, ...updatedPost } : p)),
        })
        setEditedPost(updatedPost)
        onClose()
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      alert('Failed to save post. Please try again.')
      console.error('Failed to save post:', error)
    } finally {
      setIsLoading(false)
    }
  }, [editedPost, post.id, dispatch, state.posts, onClose])

  return (
    <>
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: styles.dialog }}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Title"
            value={editedPost.title}
            onChange={handleInputChange('title')}
            sx={styles.textField}
          />
          <TextField
            fullWidth
            variant="outlined"
            multiline
            minRows={4}
            maxRows={10}
            value={editedPost.content}
            onChange={handleInputChange('content')}
            sx={{ overflowY: 'auto' }}
          />
          <Box sx={styles.contentBox}>
            {post.author?.name && (
              <Typography variant="caption" color="text.secondary">
                Author: {post.author.name}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Created At: {formatDateTime(post.createdAt)}
            </Typography>
            {post.updatedAt && (
              <Typography variant="caption" color="text.secondary">
                Updated At: {formatDateTime(post.updatedAt)}
              </Typography>
            )}
            {post.deletedAt && (
              <Typography variant="caption" color="error">
                Deleted At: {formatDateTime(post.deletedAt)}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <Box sx={styles.actionBox}>
          <Button onClick={() => setDeleteDialogOpen(true)} variant="contained" sx={styles.deleteButton}>
            Delete
          </Button>
          <Button onClick={handleSave} variant="contained" disabled={isLoading} sx={styles.saveButton}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </Button>
        </Box>
      </Dialog>

      <DeletePostDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        postId={post.id}
      />
    </>
  )
}

export default EditPostDialog
