import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { isAuthenticated, handleLogout } = useAuth();

  return (
    <header>
      <h1>Blog Admin</h1>
      {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
    </header>
  );
};

export default Header;
