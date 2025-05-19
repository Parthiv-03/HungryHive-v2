// import React, { useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux';
// import { setlogin, setlogout } from '../../redux-toolkit/loginSlice';
// import {
//   Button,
//   FormControl,
//   InputLabel,
//   OutlinedInput,
//   TextField,
//   InputAdornment,
//   Link,
//   IconButton,
//   Box,
//   Divider,
//   Modal,
// } from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { AppProvider, SignInPage } from '@toolpad/core';
// import { signInWithGoogle } from '../../services/firebase';
// import GoogleIcon from '../../assets/google-logo.jpg'
// import axios from 'axios';

// const providers = [{ id: 'credentials', name: 'Email and Password' }];

// function CustomEmailField() {
//   return (
//     <TextField
//       id="input-textfield"
//       label="Email Address"
//       name="email"
//       type="email"
//       size="small"
//       fullWidth
//       variant="outlined"
//     />
//   );
// }

// function CustomPasswordField() {
//   const [showPassword, setShowPassword] = useState(false);

//   const handleClickShowPassword = () => setShowPassword((show) => !show);

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

//   return (
//     <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
//       <InputLabel size="small" htmlFor="outlined-adornment-password">
//         Password
//       </InputLabel>
//       <OutlinedInput
//         id="outlined-adornment-password"
//         type={showPassword ? 'text' : 'password'}
//         name="password"
//         size="small"
//         endAdornment={
//           <InputAdornment position="end">
//             <IconButton
//               aria-label="toggle password visibility"
//               onClick={handleClickShowPassword}
//               onMouseDown={handleMouseDownPassword}
//               edge="end"
//               size="small"
//             >
//               {showPassword ? (
//                 <VisibilityOff fontSize="inherit" />
//               ) : (
//                 <Visibility fontSize="inherit" />
//               )}
//             </IconButton>
//           </InputAdornment>
//         }
//         label="Password"
//       />
//     </FormControl>
//   );
// }

// function CustomButton({Text}) {
//   return (
//     <Button
//       type="submit"
//       variant="outlined"
//       color="info"
//       size="small"
//       disableElevation
//       fullWidth
//       sx={{ my: 2 }}
//     >
//       {Text}
//     </Button>
//   );
// }

// function SignUpLink({ onClick, Text }) {
//   return (
//     <Box
//       component="span"
//       sx={{
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         cursor: 'pointer',
//         color: 'primary.main',
//         textDecoration: 'underline',
//       }}
//       onClick={onClick}
//     >
//       {Text}
//     </Box>
//   );
// }

// function ForgotPasswordLink() {
//   return (
//     <Link href="/" variant="body2">
//       Forgot password?
//     </Link>
//   );
// }

// function GoogleSignInButton({ onClose, setisloggedin }) {
//   const dispatch = useDispatch();

//   const handleGoogleSignIn = async () => {
//     const user = await signInWithGoogle();
//     if (user) {
//       dispatch(setlogin());
//       setisloggedin(true);
//       console.log("signed in");
//       onClose();
//     }
//   };

//   return (
//     <Button
//       variant="outlined"
//       color="primary"
//       fullWidth
//       onClick={handleGoogleSignIn}
//       sx={{
//         my: 2,
//         textTransform: 'none',
//         borderColor: '#4285F4',
//         color: '#4285F4',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Box
//         component="img"
//         src={GoogleIcon}
//         alt="Google logo"
//         sx={{ width: 20, height: 20, marginRight: 1 }}
//       />
//       Sign in with Google
//     </Button>
//   );
// }

// export default function Login({ isOpen, onClose, setisloggedin }) {
//   const [isRegisterForm, setIsRegisterForm] = useState(false); // State to toggle forms

//   const toggleForm = () => {
//     setIsRegisterForm((prev) => !prev);
//   };

//   // Function to handle user logout
//   const handleLogout = () => {
//     dispatch(setlogout());
//     onClose(); // Close the modal
//   };

//   return (
//     <AppProvider>
//       <Modal
//         open={isOpen}
//         onClose={onClose}
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Box
//           sx={{
//             backgroundColor: 'background.paper',
//             borderRadius: 2,
//             p: 1.5,
//             outline: 'none',
//             boxShadow: 24,
//           }}
//         >

//       {isRegisterForm ? (
//         <>
//           <SignInPage
//               signIn={(provider, formData) => {
//                   alert(
//                     Signing in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}
//                   );

//                 }
//               }
//               slots={{
//                 emailField: CustomEmailField,
//                 passwordField: CustomPasswordField,
//                 submitButton: ()=> <CustomButton Text="Sign-Up"/>,
//                 // forgotPasswordLink: ForgotPasswordLink,
//               }}
//               providers={providers}
//             />
//           <SignUpLink onClick={toggleForm} Text="SignIn here"/>
//         </>
//       ) : (
//         <>
//           <SignInPage
//               signIn={(provider, formData) =>
//                 alert(
//                   Signing in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}
//                 )
//               }
//               showRememberMe={false}
//               slots={{
//                 emailField: CustomEmailField,
//                 passwordField: CustomPasswordField,
//                 submitButton: ()=> <CustomButton Text="Sign-In"/>,
//                 // forgotPasswordLink: ForgotPasswordLink,
//               }}
//               providers={providers}
//             />
//           <SignUpLink onClick={toggleForm} Text="Don't have an account? Click here"/>
//         </>
//       )}

//           <Divider sx={{ my: 2 }} />

//           <GoogleSignInButton onClose={onClose} setisloggedin={setisloggedin} />
//         </Box>
//       </Modal>
//     </AppProvider>
//   );
// }




import React, { useState } from 'react'
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

function GoogleSignInButton({ onClose }) {   //setisloggedin
  const dispatch = useDispatch();

  // const handleGoogleSignIn = async () => {
  //   const user = await signInWithGoogle();
  //   if (user) {
  //     dispatch(setlogin(user.uid));
  //     console.log(user.email);
  //     // setisloggedin(true);
  //     console.log(user.displayName);
  //     console.log("signed in");
  //     onClose();
  //   }
  // };

  const handleGoogleSignIn = async () => {
    const user = await signInWithGoogle();
    
    if (user) {
      try {
        const userEmail = user.email;
        const username = user.displayName;
        const response = await axios.post('http://localhost:5000/api/users/create-user', { email: userEmail, name: username});
    
        let User = response.data.user;
  
        dispatch(setlogin(User));
        console.log("Signed in and userId set in Redux:", User);
  
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
        const response = await axios.post('http://localhost:5000/api/users/sendOTP', {
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
        const response = await axios.post('http://localhost:5000/api/users/create-user', { email: email, name: 'User' });

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