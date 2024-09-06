import React, { useState, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { validateToken } = useAuth();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      if (!validateEmail) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to login");
        }

        const { token } = data;
        localStorage.setItem("token", token);
        validateToken();
        setError("");
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "An error occurred while logging in");
        setLoading(false);
      }
    },
    [email, password, validateToken]
  );

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
