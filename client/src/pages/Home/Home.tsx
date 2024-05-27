// @ts-nocheck
import React from "react";
import Login from "../../component/Login/Login";
import Logout from "../../component/Logout/Logout";
import CoinsAndDollars from "../../component/CoinsAndDollars/CoinsAndDollars";
import { Link } from "react-router-dom";


const Home = () => {

  return (
    <>

      <Login></Login>
      <CoinsAndDollars></CoinsAndDollars>
      <div>Home</div>
      <Link to={'add-recipe'}>Add Recipe</Link>
      <Logout></Logout>
    </>
  );
};

export default Home;
