import { getAuth, signOut } from "firebase/auth";
import React from "react";
import app from "../../firebase/firebase";
// import { auth } from "../../firebase/firebase";
// import firebase from "firebase/app";

const Logout: React.FC = () => {
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      // @ts-ignore
      const result = await signOut(auth);
      // Handle successful logout
      console.log("User logged out successfully");
      // You can clear user data from Redux store or perform other actions as needed
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error
    }
  };

  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Sign out</button>
    </div>
  );
};

export default Logout;
