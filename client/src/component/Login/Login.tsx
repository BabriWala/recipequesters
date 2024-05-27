// @ts-nocheck
import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../../firebase/firebase";
import { useDispatch } from "react-redux";
import { loginUserSuccess } from "../../actions/actions";
import axiosClient from "../../axios/axiosClient";
import { saveState } from "../../middleware/sessionStorage";

const Login: React.FC = () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // Extract user information
      const displayName = user.displayName;
      const photoURL = user.photoURL;
      const email = user.email;
      const userDetails = {
        displayName,
        photoURL,
        email,
      };
      try {
        const response = await axiosClient.post("users/register", userDetails);
        console.log(response)
        console.log(response?.data)
        saveState({ user: response?.data })
        dispatch(loginUserSuccess(response?.data))
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email; // Update here, handle `undefined`
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
