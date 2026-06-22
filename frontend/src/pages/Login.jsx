import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { validateEmail } from '../utils/helper'
import axiosInstance from '../utils/axiosInstance'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase-config'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await axiosInstance.post('/api/user/google-login', {
        idToken,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled.');
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setError("");


    // Login API Call

    try {
      const responce = await axiosInstance.post("/api/user/login", {
        email: email,
        password: password,
      });
      //handle successfull login responce

      // console.log("Login Response:", responce);
      
      if (responce.data && responce.data.token) {
        localStorage.setItem("token", responce.data.token);
        navigate("/");
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
    } else {
        setError("An unexpected error occurred. Please try again.");
    }
    }
}


  return (
    <>
      <Navbar />

      <div className='flex items-center justify-center min-h-[calc(100vh-72px)] py-10 px-4'>
        <div className='w-full max-w-md drop-shadow rounded bg-white px-6 py-10 sm:px-8 sm:py-12' >
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input type="text" placeholder='email' className="input-box "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button className='btn-primary' type='submit'>LogIn</button>

            <button
              type='button'
              onClick={handleGoogleSignIn}
              className='w-full rounded-md border border-slate-300 bg-white py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 mt-3 flex items-center justify-center gap-2'
            >
              <FcGoogle size={18} />
              <span>Sign in with Google</span>
            </button>

            <p className="text-sm text-center mt-4">Not Registered yet? {" "}
              <Link to={"/signup"} className='text-primary font-medium underline'>Create an account.</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login