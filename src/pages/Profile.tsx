
import React from "react";
import { User } from "lucide-react";

const Profile: React.FC = () => {
  return (
    <div className="container px-4 py-6 mb-20">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="bg-card rounded-xl shadow-lg border border-gray-800 p-6 text-center">
        <div className="flex justify-center items-center h-24 w-24 bg-gray-800 rounded-full mb-4 mx-auto">
          <User className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Guest User</h2>
        <p className="text-gray-400 mb-4">
          Create an account to save your journal entries and preferences
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-4 py-2 bg-secondary text-white rounded-md">Sign Up</button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-md">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
