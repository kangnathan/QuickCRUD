'use client'
import React, { useState, useCallback } from 'react'
import { Typography, IconButton, Paper, Menu, MenuItem, Popover, Grid } from '@mui/material'
import PushPinIcon from '@mui/icons-material/PushPin'
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeletePostDialog from './DeletePostDialog'
import EditPostDialog from './EditPostDialog'
import { usePostContext } from '@/app/context/PostContext'
import postStyles from '../app/styles/postStyles'

const colors = [
  '#77162f', '#682b16', '#7d4b03', '#274c3b',
  '#0d625c', '#246376', '#294254', '#472e5b',
  '#6d394e', '#4a453a', '#2e2e2e'
]

const Post = ({ post }) => {
  const [expanded, setExpanded] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [colorAnchorEl, setColorAnchorEl] = useState(null)
  const [bgColor, setBgColor] = useState(post.color || '#2e2e2e')

  const { state, pinPost, unpinPost, updatePostColor } = usePostContext()
  const isPinned = state.posts.some(p => p.id === post.id && p.pinned)

  const handleExpandClick = useCallback((e) => {
    if (!anchorEl && !colorAnchorEl) setExpanded(true)
  }, [anchorEl, colorAnchorEl])

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true)
    handleMenuClose()
  }, [])

  const handleDeleteClose = useCallback(() => {
    setDeleteDialogOpen(false)
    setExpanded(false)
  }, [])

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget)

  const handleMenuClose = () => setAnchorEl(null)

  const handleColorClick = (event) => setColorAnchorEl(event.currentTarget)

  const handleColorClose = () => setColorAnchorEl(null)

  const handleColorSelect = async (color) => {
    setBgColor(color)
    await updatePostColor(post.id, color)
    handleColorClose()
  }

  const handlePinClick = async (e) => {
    e.stopPropagation()
    try {
      isPinned ? await unpinPost(post.id) : await pinPost(post.id)
    } catch (error) {
      console.error('Error pinning/unpinning post:', error)
    }
  }

  return (
    <>
      <Paper elevation={3} sx={postStyles.paper(bgColor)} onClick={handleExpandClick}>
        <Typography variant="h6" color="white" sx={postStyles.title}>
          {post.title}
        </Typography>

        <Typography variant="body2" color={post.content ? 'white' : 'text.disabled'} sx={postStyles.content(post)}>
          {post.content || (
            <i style={{ color: 'white', display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
              No content provided.
            </i>
          )}
        </Typography>

        <IconButton className="pin-icon" onClick={handlePinClick} sx={postStyles.pinIcon(isPinned)}>
          {isPinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
        </IconButton>

        <IconButton className="color-icon" onClick={(e) => {
          e.stopPropagation()
          handleColorClick(e)
        }} sx={postStyles.colorIcon}>
          <ColorLensIcon />
        </IconButton>

        <IconButton className="more-icon" onClick={(e) => {
          e.stopPropagation()
          handleMenuClick(e)
        }} sx={postStyles.moreIcon}>
          <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick() }}>Delete</MenuItem>
        </Menu>

        <Popover
          anchorEl={colorAnchorEl}
          open={Boolean(colorAnchorEl)}
          onClose={handleColorClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Grid container spacing={1} style={postStyles.colorPopover}>
            {colors.map((color) => (
              <Grid item key={color}>
                <div
                  onClick={() => handleColorSelect(color)}
                  style={postStyles.colorPicker(color)}
                />
              </Grid>
            ))}
          </Grid>
        </Popover>
      </Paper>

      <EditPostDialog post={post} open={expanded} onClose={() => setExpanded(false)} />
      <DeletePostDialog open={deleteDialogOpen} onClose={handleDeleteClose} postId={post.id} />
    </>
  )
}

export default Post
