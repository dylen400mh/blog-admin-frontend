import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import PostList from "./components/PostList";
import { isTokenExpired } from "./isTokenExpired";
import { useAuth } from "./AuthContext";

const App: React.FC = () => {
  const { isAuthenticated, handleLogout, handleLogin } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      handleLogout();
    } else {
      handleLogin();
    }
  }, [handleLogin, handleLogout]);

  return (
    <div className="App">
      <h1>Blog Admin</h1>
      {isAuthenticated ? <PostList /> : <LoginForm />}
    </div>
  );
};

export default App;
