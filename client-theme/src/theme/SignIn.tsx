// src/components/SignIn.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../firebaseConfig';
import { setUser } from '../store/authSlice';
import { AppDispatch } from '../store/store';

const SignIn = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSignIn = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider);
            dispatch(setUser(result.user));
            navigate('/');
        } catch (error) {
            console.error('Failed to sign in', error);
        }
    };

    return (
        <div>
            <button onClick={() => handleSignIn(googleProvider)}>Sign in with Google</button>
            <button onClick={() => handleSignIn(facebookProvider)}>Sign in with Facebook</button>
        </div>
    );
};

export default SignIn;
