
import React from "react";
import { Book, Cannabis, Map } from "lucide-react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="container px-4 py-6 mb-20">
      <h1 className="text-2xl font-bold mb-6 text-white">German Cannabis Explorer</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/journal" className="block hover:scale-[1.02] transition-transform duration-200">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-center items-center h-20 w-20 bg-gray-700 rounded-full mb-4 mx-auto">
              <Book className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Track in Journal</h2>
            <p className="text-gray-400 text-center">
              Keep a personal cannabis journal to record your experiences
            </p>
          </div>
        </Link>
        
        <Link to="/strains" className="block hover:scale-[1.02] transition-transform duration-200">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-center items-center h-20 w-20 bg-gray-700 rounded-full mb-4 mx-auto">
              <Cannabis className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Explore Strains</h2>
            <p className="text-gray-400 text-center">
              Discover cannabis strains with detailed profiles and effects
            </p>
          </div>
        </Link>
        
        <Link to="/clubs" className="block hover:scale-[1.02] transition-transform duration-200">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 h-full">
            <div className="flex justify-center items-center h-20 w-20 bg-gray-700 rounded-full mb-4 mx-auto">
              <Map className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-xl font-bold text-white text-center mb-2">Find Clubs</h2>
            <p className="text-gray-400 text-center">
              Locate cannabis clubs in your area with our interactive map
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
