
import React from "react";
import { Book, Cannabis, Map } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="container px-4 py-6 mb-20">
      <h1 className="text-2xl font-bold mb-6">German Cannabis Explorer</h1>
      
      <div className="space-y-6">
        <Link to="/journal">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-center items-center h-24 w-24 bg-gray-100 rounded-full mb-4 mx-auto">
              <Book className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Track in Journal</h2>
            <p className="text-gray-500 text-center">
              Keep a personal cannabis journal to record your experiences
            </p>
          </div>
        </Link>
        
        <Link to="/">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-center items-center h-24 w-24 bg-gray-100 rounded-full mb-4 mx-auto">
              <Cannabis className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Explore Strains</h2>
            <p className="text-gray-500 text-center">
              Discover cannabis strains with detailed profiles and effects
            </p>
          </div>
        </Link>
        
        <Link to="/clubs">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-center items-center h-24 w-24 bg-gray-100 rounded-full mb-4 mx-auto">
              <Map className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Find Clubs</h2>
            <p className="text-gray-500 text-center">
              Locate cannabis clubs in your area with our interactive map
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
