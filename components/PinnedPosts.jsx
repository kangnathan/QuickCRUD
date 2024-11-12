import { Box, Typography, Grid, Grow } from '@mui/material'
import Post from './Post'
import { usePostContext } from '@/app/context/PostContext'

export default function PinnedPosts() {
  const { state: { posts }, unpinPost } = usePostContext()

  const pinnedPosts = posts.filter(post => post.pinned)

  if (!pinnedPosts.length) {
    return null
  }

  return (
    <Box sx={{ padding: '45px', borderRadius: '10px', marginBottom: '40px' }}>
      <Typography variant="h6" sx={{ marginBottom: '15px', color: '#FFFFFF' }}>
        Pinned Posts
      </Typography>
      <Grid container spacing={2}>
        {pinnedPosts.map(post => (
          <Grow in key={post.id} timeout={500}>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4}>
              <Post
                post={post}
                isPinned
                onPin={() => unpinPost(post.id)}
              />
            </Grid>
          </Grow>
        ))}
      </Grid>
    </Box>
  )
}


