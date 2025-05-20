import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setlogin } from '../../redux-toolkit/userSlice';
import {
  Button,
  TextField,
  Box,
  Divider,
  Modal,
  Typography,
} from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';import { AppProvider } from '@toolpad/core';
import { signInWithGoogle } from '../../services/firebase';
import GoogleIcon from '../../assets/google-logo.jpg'
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function GoogleSignInButton({ onClose }) {   //setisloggedin
  const dispatch = useDispatch();



  const handleGoogleSignIn = async () => {
    const user = await signInWithGoogle();
    
    if (user) {
      try {
        const userEmail = user.email;
        const username = user.displayName;
        const response = await axios.post(`${apiBaseUrl}/api/users/create-user`, { email: userEmail, name: username});
    
        let User = response.data.user;
  
        dispatch(setlogin(User));
        
  
        onClose();
        
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      fullWidth
      onClick={handleGoogleSignIn}
      sx={{
        my: 2,
        textTransform: 'none',
        borderColor: '#4285F4',
        color: '#4285F4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="img"
        src={GoogleIcon}
        alt="Google logo"
        sx={{ width: 20, height: 20, marginRight: 1 }}
      />
      Sign in with Google
    </Button>
  );
}

export default function Login({ isOpen, onClose }) {   //setisloggedin
  const [isOTPsent, setIsOTPsent] = useState(false); // State to toggle forms
  const [email, setEmail] = useState(''); // Email input
  const [otp, setOtp] = useState(''); // OTP input
  const [Correctotp, setCorrectotp] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateOTP = (otp) => {
    return !isNaN(otp) && otp===Correctotp; 
  };

  const handleSendOTP = async () => {
    if (validateEmail(email)) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/users/sendOTP`, {
          email: email,  
        });

        if (response.status === 200) {
          setIsOTPsent(true);
          setCorrectotp(response.data.otp);
          setErrorMessage('');
          console.log(`OTP sent to ${email}`);
        } else {
          setErrorMessage(`Error: ${response.data.error}`);
        }
      } catch (error) {
        // Handle network or server errors
        setErrorMessage(`Error sending OTP: ${error.response ? error.response.data.error : error.message}`);
      }

    } else {
      setErrorMessage('Please enter a valid email address.');
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    if (validateOTP(otp)) {
      try {
        const response = await axios.post(`${apiBaseUrl}/api/users/create-user`, { email: email, name: 'User' });

        let User = response.data.user;

        dispatch(setlogin(User));
        console.log("Signed in and userId set in Redux:", User);

        setCorrectotp('');
        setIsOTPsent(false);
        setOtp('');
        setEmail('');
        setErrorMessage('');
        onClose();
      }
      catch (error) {
        console.error('Error creating user:', error);
      }
    } else {
      setErrorMessage('Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <AppProvider>
      <Modal
        open={isOpen}
        onClose={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            p: 2.5,
            outline: 'none',
            boxShadow: 24,
          }}
        >

          {isOTPsent ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ChevronLeftOutlinedIcon sx={{ fontSize: '2rem' }} onClick={() => { setIsOTPsent(false); setOtp(""); setErrorMessage(""); }} />
                <Typography
                  variant="subtitle1"
                  align="center"
                  sx={{
                    fontSize: '1.3rem',
                  }}
                >
                  Hungry? Let the Hive Take Care of It!
                </Typography>
              </Box>
              <TextField
                label="Enter OTP"
                fullWidth
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                sx={{ mb: 2 }}
                type="email"
              />
              <Button variant="contained" fullWidth onClick={handleVerifyOTP}>
                Verify OTP
              </Button>
              {errorMessage && <p style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</p>}
            </>
          ) : (
            <>
              <Typography
                variant="subtitle1"
                align="center"
                sx={{
                  mb: 2,
                  fontSize: '1.3rem', 
                }}
              >
                Hungry? Let the Hive Take Care of It!
              </Typography>
              <TextField
                label="Email Address"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" fullWidth onClick={handleSendOTP}>
                Send OTP
              </Button>
              {errorMessage && <p style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</p>}
            </>
          )}

          <Divider sx={{ my: 2 }} />

          <GoogleSignInButton onClose={onClose} />    
        </Box>
      </Modal>
    </AppProvider>
  );
}