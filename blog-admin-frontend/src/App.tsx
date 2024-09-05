import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import PostList from "./components/PostList";
import { isTokenExpired } from "./util/isTokenExpired";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";

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
      <Header />
      {isAuthenticated ? <PostList /> : <LoginForm />}
    </div>
  );
};

export default App;
