import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { isAuthenticated, handleLogout } = useAuth();

  console.log(isAuthenticated);
  return (
    <header className="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Blog Admin</h1>
      {isAuthenticated && (
        <button
          onClick={handleLogout}
          className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
