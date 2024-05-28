import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "tailwindcss/tailwind.css";
import { useDispatch, useSelector } from "react-redux";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "../../firebase/firebase";
import { saveState } from "../../middleware/sessionStorage";
import axiosClient from "../../axios/axiosClient";
import { loginUserSuccess } from "../../actions/actions";

const images = [
  "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg",
  "https://images.pexels.com/photos/2232/vegetables-italian-pizza-restaurant.jpg",
  "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
  "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg",
];

const Banner = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const user = useSelector((state) => state?.user);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addRecipe = async () => {
    if (user?.user) {
      navigate("/add-recipe");
      return null;
    }
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
        navigate("/add-recipe");
      } catch (err) {}
    } catch (error) {}
  };
  return (
    <>
      <div className=" container mx-auto py-8">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index} className="relative h-[100vh]">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
                <h2 className="text-white text-4xl font-bold mb-4">
                  Welcome to RecipeQuest
                </h2>
                <p className="text-white text-lg mb-4">
                  Discover and share your favorite recipes!
                </p>
                <div>
                  <Link
                    to="/recipe"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  >
                    All Recipes
                  </Link>
                  <button
                    onClick={addRecipe}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Add Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Banner;
