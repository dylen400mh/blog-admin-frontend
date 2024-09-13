import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <header className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Blog Admin</h1>
      {isAuthenticated && (
        <button
          onClick={handleLogoutClick}
          className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
