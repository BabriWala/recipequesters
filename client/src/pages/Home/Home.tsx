import React from "react";
import Login from "../../component/Login/Login";
import Logout from "../../component/Logout/Logout";

const Home = () => {
  return (
    <>
      <Login></Login>
      <div>Home</div>
      <Logout></Logout>
    </>
  );
};

export default Home;
