
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/7bfa1a23-8c92-4adb-b85b-63bb2f75ff2c.png" 
              alt="SocialClub Map Logo"
              className="h-10 w-auto" 
            />
            <span className="font-bold text-xl text-foreground">SocialClub Map</span>
          </Link>
          
          <Link to="/profile" className="ml-auto">
            <div className="h-9 w-9 bg-primary/20 hover:bg-primary/30 transition-colors rounded-full flex items-center justify-center shadow-sm">
              <User className="h-5 w-5 text-primary" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
