import { Link, Outlet } from "react-router-dom";
import Login from "../component/Login/Login";
import Logout from "../component/Logout/Logout";
import CoinsAndDollars from "../component/CoinsAndDollars/CoinsAndDollars";
import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";

const Layout = () => {
  return (
    <>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </>
  );
};

export default Layout;
