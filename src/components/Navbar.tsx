
import React from "react";
import { Link } from "react-router-dom";
import { Cannabis } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="bg-[#131922] border-b border-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Cannabis className="h-6 w-6 text-[#4CAF50]" />
              <span className="font-bold text-xl text-white">GCE</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
