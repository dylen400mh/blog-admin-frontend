import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import PostList from "./components/PostList";
import { isTokenExpired } from "./isTokenExpired";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      handleLogout();
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem("token") || "";
    console.log("login " + token);

    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <h1>Blog Admin</h1>
      {isAuthenticated ? (
        <PostList onLogout={handleLogout} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
