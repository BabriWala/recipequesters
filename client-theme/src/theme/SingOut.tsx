// src/components/SignOut.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { setUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store/store';

const SignOut = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            dispatch(setUser(null));
            navigate('/signin');
        } catch (error) {
            console.error('Failed to sign out', error);
        }
    };

    return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOut;
