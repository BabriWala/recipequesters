import React from "react";

import AboutMeSection from "../../component/AboutMeSection/AboutMeSection";
import Banner from "../../component/Banner/Banner";
import SuccessStoriesSection from "../../component/SuccessStoriesSection/SuccessStoriesSection";
const Home = () => {
  return (
    <>
      <Banner></Banner>
      <SuccessStoriesSection></SuccessStoriesSection>
      <AboutMeSection></AboutMeSection>
    </>
  );
};

export default Home;
