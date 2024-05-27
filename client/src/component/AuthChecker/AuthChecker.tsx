// @ts-nocheck
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AuthChecker = ({ children }) => {
    // Access user information from Redux store
    const user = useSelector(state => state.user);
    const isLoggedIn = !!user;
    const navigate = useNavigate();

    useEffect(() => {
        // If user is not logged in, redirect to login page
        if (!isLoggedIn) {
            toast.error("You have to be logged in for further process", { duration: 1000 });
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    // If user is logged in, render the children components
    return <>{children}</>;
};

export default AuthChecker;
