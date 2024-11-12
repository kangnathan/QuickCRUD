"use client";
import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { textFieldStyles, buttonStyles } from '../app/styles/forms';

const InputField = ({ name, label, type }) => (
  <Box mb={3}>
    <TextField
      fullWidth
      name={name}
      label={label}
      autoComplete="off"
      variant="outlined"
      type={type}
      sx={textFieldStyles}
    />
  </Box>
);

const PasswordInputField = ({ name, label }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box mb={3}>
      <TextField
        fullWidth
        name={name}
        label={label}
        autoComplete="off"
        variant="outlined"
        type={showPassword ? "text" : "password"}
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
  );
};

export default function RegisterForm() {
  const [formState, setFormState] = useState({ errors: {}, success: null });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    setLoading(true);
    setFormState({ errors: {}, success: null });

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setFormState({ success: "Account created successfully!", errors: {} });
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        setFormState({ errors: result.errors || { global: "An error occurred" }, success: null });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setFormState({ errors: { global: "Something went wrong." }, success: null });
    } finally {
      setLoading(false);
    }
  };

  const { errors, success } = formState;

  return (
    <Container maxWidth="xs">
      <Typography variant="h2" sx={{ textAlign: "center", color: "white" }}>
        <strong>Sign Up</strong>
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <InputField name="name" label="Username" type="text" />
        <InputField name="email" label="Email" type="text" />
        <PasswordInputField name="password" label="Password" />

        <Button
          fullWidth
          variant="contained"
          sx={buttonStyles}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Box display="flex" alignItems="center">
              <CircularProgress size={24} sx={{ color: 'white', marginRight: 1 }} />
              Creating Account...
            </Box>
          ) : (
            "Create Account"
          )}
        </Button>

        <Box mt={2}>
          {(errors.global || errors.name || errors.email || errors.password) && (
            <Alert variant="filled" severity="warning">
              {errors.global || errors.name || errors.email || errors.password}
            </Alert>
          )}
          {success && (
            <Alert variant="filled" severity="success">
              {success}
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}
