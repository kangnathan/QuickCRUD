'use client';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';
import '../styles/forgot-password.css';
import {
    containerStyles,
    signUpContainerStyles,
    otpTextFieldStyles,
    passwordTextFieldStyles,
    resetButtonStyles,
    signInContainerStyles,
    emailTextFieldStyles,
    sendOtpButtonStyles,
    overlayLeftButtonStyles,
    overlayRightButtonStyles,
} from '../styles/forgotpassword';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const router = useRouter();

    const signUpButtonRef = useRef(null);
    const signInButtonRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const signUpButton = signUpButtonRef.current;
        const signInButton = signInButtonRef.current;
        const container = containerRef.current;

        const handleSignUpClick = () => container.classList.add("right-panel-active");
        const handleSignInClick = () => container.classList.remove("right-panel-active");

        signUpButton?.addEventListener('click', handleSignUpClick);
        signInButton?.addEventListener('click', handleSignInClick);

        return () => {
            signUpButton?.removeEventListener('click', handleSignUpClick);
            signInButton?.removeEventListener('click', handleSignInClick);
        };
    }, []);

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleApiRequest = async (url, method, body) => {
        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (response.ok) return data;
            throw new Error(data.message || 'Something went wrong');
        } catch (error) {
            console.error(error);
        }
    };

    const sendEmail = async () => {
        const data = await handleApiRequest("/api/send-email", "POST", { email });
        if (data) {
            setSnackbarMessage("OTP sent successfully!");
            setSnackbarOpen(true);
            setIsOtpSent(true);
        }
    };

    const resetPassword = async () => {
        if (newPassword !== confirmPassword) return console.error("Passwords do not match");

        const data = await handleApiRequest("/api/send-email", "PUT", { email, otp, newPassword });
        if (data) {
            setSnackbarMessage("Password changed successfully!");
            setSnackbarOpen(true);
            setTimeout(() => router.push('/login'), 3000);
        }
    };

    return (
        <>
            <Typography variant="h6" component="div">
                <Link href="/login" style={{ textDecoration: 'none', textAlign: 'center', color: 'white' }}>
                    <Typography marginTop="50px" variant="h2" sx={{ marginBottom: '100px' }}>
                        <strong>Quick<span style={{ color: '#BB86FC' }}>CRUD</span></strong>
                    </Typography>
                </Link>
            </Typography>

            <Box className="container" id="container" sx={containerStyles} ref={containerRef}>
                <Box className="form-container sign-up-container" sx={signUpContainerStyles}>
                    <form onSubmit={(e) => { e.preventDefault(); resetPassword(); }}>
                        <TextField
                            label="OTP"
                            variant="outlined"
                            margin="normal"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            sx={otpTextFieldStyles}
                        />
                        <TextField
                            label="New Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={passwordTextFieldStyles}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={passwordTextFieldStyles}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={resetButtonStyles}
                        >
                            Reset Password
                        </Button>
                    </form>
                </Box>

                <Box className="form-container sign-in-container" sx={signInContainerStyles}>
                    <form onSubmit={(e) => { e.preventDefault(); sendEmail(); }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={emailTextFieldStyles}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={sendOtpButtonStyles}
                        >
                            Send OTP
                        </Button>
                    </form>
                </Box>

                <Box className="overlay-container">
                    <Box className="overlay">
                        <Box className="overlay-panel overlay-left">
                            <Typography sx={{ marginRight: '100px' }}>
                                To keep connected with us please <br /> login with your personal info
                            </Typography>
                            <Button
                                className="ghost"
                                id="signIn"
                                ref={signInButtonRef}
                                variant="contained"
                                sx={overlayLeftButtonStyles}
                            >
                                Back
                            </Button>
                        </Box>

                        <Box className="overlay-panel overlay-right">
                            <Typography variant="h5" sx={{ marginLeft: '100px' }}>
                                <strong>Forgot password?</strong>
                            </Typography>
                            <Typography sx={{ marginLeft: '100px', marginTop: '20px' }}>
                                Enter your registered email <br /> to receive OTP
                            </Typography>
                            <Button
                                className="ghost"
                                id="signUp"
                                ref={signUpButtonRef}
                                variant="contained"
                                sx={overlayRightButtonStyles}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Snackbar
                open={snackbarOpen}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                autoHideDuration={3000}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
