import React from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import app from "../../firebase/firebase";
import { useDispatch } from "react-redux";
import { loginUserSuccess, logoutUserSuccess } from "../../actions/actions";
import axiosClient from "../../axios/axiosClient";
import { saveState } from "../../middleware/sessionStorage";
import toast from "react-hot-toast";

const Login = () => {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
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
        saveState(user?.data);
        dispatch(loginUserSuccess(response?.data));
      } catch (err) {}
    } catch (error) {
      // ...
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
