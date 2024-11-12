'use client'

import { useState } from 'react'
import { Container, Typography, TextField, Button, Alert, Box, IconButton, InputAdornment, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Link from 'next/link'
import { textFieldStyles, buttonStyles } from '../styles/forms'

export default function LoginPage() {
  const [formState, setFormState] = useState({ success: null, message: '' })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleTogglePasswordVisibility = () => setShowPassword((prev) => !prev)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = {
      emailOrUsername: formData.get('emailOrUsername'),
      password: formData.get('password'),
    }

    setFormState({ success: null, message: '' })
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      // Assume the response is already standardized using NextResponse.json()
      const result = await response.json()

      if (response.ok) {
        // Check if 'success' is defined and true
        if (result.success) {
          setFormState({ success: true, message: 'Login successful!' })
          setTimeout(() => router.push('/home'), 1000)
        } else {
          // Use the message from the response if available
          setFormState({ success: false, message: result.message || 'Login failed.' })
        }
      } else {
        // Handle non-200 responses
        setFormState({ success: false, message: result.message || 'Login failed.' })
      }
    } catch (error) {
      setFormState({ success: false, message: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <Typography variant="h6" component="div">
        <Link href="/" style={{ textDecoration: 'none', textAlign: 'center', color: 'white' }}>
          <Typography marginTop="50px" variant="h2">
            <strong>Quick<span style={{ color: '#BB86FC' }}>CRUD</span></strong>
          </Typography>
        </Link>
      </Typography>
      <Typography marginTop="150px" variant="h2" sx={{ textAlign: 'center', color: 'white' }}>
        <strong>Log In</strong>
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <Box mb={3}>
          <TextField
            fullWidth
            name="emailOrUsername"
            label="Email or Username"
            autoComplete="off"
            variant="outlined"
            sx={textFieldStyles}
          />
        </Box>
        <Box mb={3}>
          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="off"
            variant="outlined"
            sx={textFieldStyles}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button fullWidth variant="contained" sx={buttonStyles} type="submit" disabled={loading } >
          {loading ? (
            <Box display="flex" alignItems="center" >
              <CircularProgress size={24} sx={{ color: 'white', marginRight: 1 }} />
              Logging in...
            </Box>
          ) : (
            'Submit'
          )}
        </Button>
        {formState.success !== null && (
          <Box mt={2}>
            <Alert variant="filled" severity={formState.success ? 'success' : 'warning'}>
              {formState.success ? 'Login successful!' : formState.message || 'Login failed.'}
            </Alert>
          </Box>
        )}
      </Box>

      <Box sx={{display: 'flex',justifyContent: 'center'}}>
      <Link href="/forgot-password" style={{textDecoration: 'none', fontFamily: 'Arial', color: 'white', marginTop: '20px'}}>
        Forgot password?
      </Link>
      </Box>

    </Container>
  )
}
