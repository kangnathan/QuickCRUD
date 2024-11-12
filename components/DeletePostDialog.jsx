import React from 'react'
import { Dialog, DialogActions, DialogTitle, Button } from '@mui/material'
import { usePostContext } from '../app/context/PostContext'
import styles from '@/app/styles/deletepostdialog'

const DeletePostDialog = ({ open, onClose, postId }) => {
  const { deletePost } = usePostContext()

  const handleConfirm = async () => {
    if (postId) {
      await deletePost(postId)
    }
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: styles.dialog }}>
      <DialogTitle sx={styles.dialogTitle}>Are you sure?</DialogTitle>
      <DialogActions sx={styles.dialogActions}>
        <Button onClick={onClose} variant="outlined" sx={styles.cancelButton}>
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained" sx={styles.confirmButton}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeletePostDialog
