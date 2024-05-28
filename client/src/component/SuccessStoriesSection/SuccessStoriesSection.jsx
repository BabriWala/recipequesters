import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import axiosClient from "../../axios/axiosClient";

const SuccessStoriesSection = () => {
  const [statistics, setStatistics] = useState(null);
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axiosClient.get("statistics/"); // Assuming your statistics endpoint is '/api/statistics'
        setStatistics(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statistics && (
            <>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Recipes Created
                </h3>
                <CountUp
                  end={statistics.recipeStatistics.recipeCount}
                  duration={2.5}
                  separator=","
                  className="text-4xl font-bold text-blue-600"
                />
                <p className="text-gray-600 mt-2">
                  Join thousands of users who have already shared their recipes
                  with us!
                </p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Happy Users
                </h3>
                <CountUp
                  end={statistics.userStatistics.userCount}
                  duration={2.5}
                  separator=","
                  className="text-4xl font-bold text-blue-600"
                />
                <p className="text-gray-600 mt-2">
                  Experience the joy of being part of our vibrant community!
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
