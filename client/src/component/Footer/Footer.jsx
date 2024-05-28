import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-4 py-8 dark:bg-gray-100 dark:text-gray-600">
      <div className="container flex flex-wrap items-center justify-center mx-auto space-y-4 sm:justify-between sm:space-y-0">
        <div className="flex flex-row pr-3 space-x-4 sm:space-x-8">
          <div className="flex font-bold whitespace-nowrap items-center justify-center flex-shrink-0  h-12 rounded-full dark:bg-violet-600">
            Recipe Questers
          </div>
          <ul className="flex flex-wrap items-center space-x-4 sm:space-x-8">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/recipe">All Recipe</Link>
            </li>
          </ul>
        </div>
        <ul className="flex flex-wrap pl-3 space-x-4 sm:space-x-8">
          <li>
            <Link
              to="https://github.com/BabriWala"
              rel="noopener noreferrer"
              href="#"
            >
              Github
            </Link>
          </li>
          <li>
            <Link to="https://www.facebook.com/babriwala.hazishaheb/">
              Facebook
            </Link>
          </li>
          <li>
            <Link to="https://www.linkedin.com/in/hanzala2022">Linked In</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
