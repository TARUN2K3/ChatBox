import React, { useState } from 'react';
import Input from '../LoginComponents/Input';
import Square from '../LoginComponents/Square';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { Link } from 'react-router-dom';
import { useSubmit } from 'react-router-dom';
import { validate } from 'react-email-validator';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Button, Paper, Typography } from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';

export default function Main() {
  const submit = useSubmit();
  const [SignUpData, setSignUpData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  function sendData(e, googleauth = null) {
    e.preventDefault(); // Prevent the default form submission behavior
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 5000);

    if (googleauth) {
      submit(googleauth, { method: 'post' });
      return;
    }

    const keys = Object.keys(SignUpData);
    let CheckError = 0;

    keys.forEach((data) => {
      if (SignUpData[data] === '') {
        CheckError = 1;
      }
    });

    if (!validate(SignUpData.email)) {
      CheckError = 1;
    }

    if (CheckError === 1) {
      alert("Error: Please fill in all fields correctly.");
    } else {
      submit(SignUpData, { method: 'post' });
    }
  }

  const responseMessage = (response) => {
    const token = response.credential;
    const decoded = jwt_decode(token);
    setSignUpData({ name: decoded.name, email: decoded.email, password: decoded.sub });
    sendData(null, { name: decoded.name, email: decoded.email, password: decoded.sub, isGoogle: true, pic: decoded.picture });
  };

  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div className='flex flex-col items-center h-[100vh] w-[100vw] relative overflow-hidden px-2'>
      <Square />
      <Square isRight={true} />
      <Paper className='z-20 w-full max-w-[370px] p-[2rem] my-auto' elevation={3}>
        <div className='font-Poppins text-3xl font-extrabold flex items-center flex-col'>
          <HowToRegIcon fontSize='large' color='primary' />
          <Typography variant='h5'>Sign Up</Typography>
        </div>
        <br />
        <hr />
        <form className='mt-6 relative' onSubmit={sendData}>
          <Input onSetData={setSignUpData} name='name' text='Name' placeholder='Enter your name' type='text' />
          <Input onSetData={setSignUpData} name='email' text="Email ID" placeholder="Email address" type='text' />
          <Input onSetData={setSignUpData} name='password' text='Password' type='password' placeholder='Password' />
          <div className='flex flex-row justify-center mt-8'>
            <Button sx={{ padding: ".5rem 4rem" }} type="submit" variant="contained">
              {!submitting && <div>SIGN UP</div>}
              {submitting && <Box sx={{ display: 'flex' }}>
                <CircularProgress size={25} style={{ color: '#FFFFFF' }} />
              </Box>}
            </Button>
          </div>
          <Typography className='text-center py-3'>Already have an account? <Link className='text-blue-600' to="/login">Log In</Link></Typography>
          <div className='h-[1px] w-[100%] mt-4 bg-[#808080]'></div>
          <div className='flex flex-col items-center mt-6'>
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
          </div>
        </form>
      </Paper>
    </div>
  );
}
