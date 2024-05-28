import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../../firebase/firebase";
import axiosClient from "../../axios/axiosClient";
import { saveState } from "../../middleware/sessionStorage";
import { loginUserSuccess, logoutUserSuccess } from "../../actions/actions";

const Header = () => {
  const user = useSelector((state) => state?.user);

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
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response?.data?.accessToken}`;
        dispatch(loginUserSuccess(response?.data));
      } catch (err) {}
    } catch (error) {}
  };

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // @ts-ignore
      const result = await signOut(auth);
      // Handle successful logout
      navigate("/");
      dispatch(logoutUserSuccess());
      toast.success("User logged out successfully");
      // You can clear user data from Redux store or perform other actions as needed
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error
    }
  };
  return (
    <header className="p-4 dark:bg-gray-100 dark:text-gray-800">
      <div className="container flex justify-between h-16 mx-auto">
        <Link
          rel="noopener noreferrer"
          to="/"
          aria-label="Back to homepage"
          className="flex items-center p-2"
        >
          Recipe Questers
        </Link>
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex">
            <Link
              rel="noopener noreferrer"
              to="recipe"
              className="flex items-center px-4 -mb-1 border-b-2 dark:border- dark:text-violet-600 dark:border-violet-600"
            >
              All Recipe
            </Link>
          </li>
          {user?.user && (
            <>
              <li className="flex">
                <Link
                  rel="noopener noreferrer"
                  to="add-recipe"
                  className="flex items-center px-4 -mb-1 border-b-2 dark:border-"
                >
                  Add Recipe
                </Link>
              </li>
              <li className=" gap-1 flex items-center px-4 -mb-1">
                <Icon icon="iconoir:coins"></Icon>
                <span>{user?.user?.coins}</span>
              </li>
              <li className=" gap-1 flex items-center px-4 -mb-1">
                <Icon icon="clarity:dollar-solid"></Icon>
                <span>{user?.user?.dollar}</span>
              </li>
            </>
          )}
        </ul>
        <div className="items-center flex-shrink-0 hidden lg:flex">
          {user?.user ? (
            <div className=" flex items-center gap-2">
              <img
                className="10 h-10 rounded-full"
                src={user?.user?.photoURL}
              />
              <span className="px-2">{user?.user?.displayName}</span>
              <button
                onClick={handleLogout}
                className="self-center px-2 py-3 rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="self-center px-8 py-3 font-semibold rounded dark:bg-violet-600 dark:text-gray-50"
            >
              Log In/Sign Up
            </button>
          )}
        </div>
        <button className="p-4 lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 dark:text-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
