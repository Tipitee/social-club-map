
import React from "react";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  // Redirect to the strains page
  return <Navigate to="/strains" replace />;
};

export default Index;
