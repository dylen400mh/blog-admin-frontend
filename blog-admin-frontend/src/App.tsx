import React, { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import PostList from "./components/PostList";
import { isTokenExpired } from "./util/isTokenExpired";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";

const App: React.FC = () => {
  const { isAuthenticated, validateToken } =
    useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateToken();
    setLoading(false);
  }, [validateToken]);

  return (
    <div className="App">
      <Header />
      {loading ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <PostList />
      ) : (
        <LoginForm />
      )}
    </div>
  );
};

export default App;
