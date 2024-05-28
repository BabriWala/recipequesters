// FirebaseProvider.jsx
import React, { createContext, useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';

const FirebaseContext = createContext<firebase.app.App | null>(null);

export const useFirebase = () => {
    const firebaseInstance = useContext(FirebaseContext);
    if (!firebaseInstance) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return firebaseInstance;
};

const FirebaseProvider = ({ children }) => {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    );
};

export default FirebaseProvider;
