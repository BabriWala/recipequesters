import React from "react";

const AboutMeSection = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">About Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Personal Information
            </h3>
            <p className="text-gray-600">
              Hi! I'm Hanzala Bin Omar, a passionate MERN Stack Developer with 1
              year of experience in software development. I love coding and
              problem-solving and enjoy building innovative solutions that make
              a difference.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Educational Background
            </h3>
            <ul className="list-disc text-gray-600">
              <li>HSC - Humanities, Dhaka College, 2022</li>
              <li>Dakhil - Science, BFIAM, 2020</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Experience
            </h3>
            <ul className="list-disc text-gray-600 ps-10 flex flex-col gap-5">
              <li>
                Full Stack Developer
                <br />
                Weero Digital - 15 January 2024 to Present
                <br />
                Responsibilities: Designing and developing user interfaces using
                a range of web technologies, including HTML, CSS, JavaScript,
                jQuery, React, Next.js, and Redux. Ensuring responsive design
                and performing frontend development work.
              </li>
              <li>
                Front End Developer
                <br />
                Innovative Skills BD - 8 September 2023 to Present
                <br />
                Responsibilities: Designing and developing user interfaces using
                a range of web technologies, including HTML, CSS, JavaScript,
                jQuery, React, Next.js, and Redux. Ensuring responsive design
                and performing frontend development work.
              </li>
              <li>
                Front End Developer
                <br />
                Happy - 1 September 2023 to 15 October 2023
                <br />
                Responsibilities: Designing and developing user interfaces using
                HTML, CSS, jQuery. Ensuring responsive design & many more.
              </li>
              <li>
                Assistant Trainer - MERN Stack Web Development
                <br />
                Eshikhon.com - 22 February 2023 to 28 August 2023
                <br />
                Responsibilities: Conducting online and offline classes,
                overseeing practice sessions, providing solutions to student
                issues, managing class schedules for online sessions, and
                ensuring effective class management.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Technology Expertise
            </h3>
            <ul className="list-disc text-gray-600 ps-10 flex flex-col gap-5">
              <li>
                Front-End: HTML, CSS, Bootstrap, Tailwind, JavaScript, jQuery,
                React, Firebase, Next.js (Beginner), Redux (Beginner), Axios
              </li>
              <li>Back-End: NodeJS, Mongoose, ExpressJS</li>
              <li>Database: MongoDB</li>
              <li>
                Tools: Chrome & Firefox Dev Tool, Netlify, Postman, Vercel,
                Github, VS Code, Figma, Photoshop
              </li>
              <li>
                Soft Skills: MS Word, Excel, Powerpoint, Basic Illustrator
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
