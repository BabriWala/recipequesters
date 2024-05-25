// src/components/Home.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div>
            <h1>Welcome, {user?.displayName || user?.email}</h1>
            <Link to="/signout">Sign Out</Link>
        </div>
    );
};

export default Home;
