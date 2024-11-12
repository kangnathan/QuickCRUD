'use client'
import React, { useEffect, useState } from 'react'
import { Container, Typography, Divider, Box, CircularProgress } from '@mui/material'
import DatePicker from '../../components/DatePicker'
import MenuBar from '@/components/MenuBar'
import PinnedPosts from '@/components/PinnedPosts'
import NonPinnedPosts from '@/components/NonPinnedPost'
import { usePostContext } from '../context/PostContext'
import useFetchUser from '../hooks/useFetchUser'
import useFetchPosts from '../hooks/useFetchPosts'
import { UserProvider } from '@/app/context/UserContext'

export default function HomeClient() {
  const { state } = usePostContext()
  const { user, startDate, endDate, error, posts } = state
  const [isLoading, setIsLoading] = useState(true)

  useFetchUser()

  const fetchPosts = useFetchPosts(user, startDate, endDate)

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user, startDate, endDate])

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: '20vh' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container
        maxWidth={false}
        sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
        <Typography sx={{ marginLeft: '15px', fontSize: '20px', color: 'white' }}>
          Getting thoughts...
        </Typography>
      </Container>
    )
  }

  const pinnedPosts = posts.filter(post => post.pinned)
  const nonPinnedPosts = posts.filter(post => !post.pinned)

  return (
    <UserProvider>
      <Container maxWidth={false} sx={{ minHeight: '100vh', padding: '20px' }}>
        <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#202124' }}>
          <MenuBar />
          <Divider variant="middle" sx={{ borderColor: '#CDCDCD', marginBottom: '30px' }} />
        </Box>

        <Box display="flex" alignItems="center" marginLeft="40px">
          <DatePicker/>
        </Box>

        {pinnedPosts.length === 0 && nonPinnedPosts.length === 0 ? (
          <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: '22px', color: '#FFFFFF', textAlign: 'center' }}>
              No thoughts found.
            </Typography>
          </Box>
        ) : (
          <>
            <PinnedPosts />
            <NonPinnedPosts />
          </>
        )}
      </Container>
    </UserProvider>
  )
}
