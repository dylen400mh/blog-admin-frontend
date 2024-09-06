import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Post } from "../types/Post";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";

const PostForm: React.FC = () => {
  const [post, setPost] = useState<Post>({
    id: 0,
    title: "",
    content: "",
    isPublished: false,
    createdAt: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState("POST");
  const { validateToken } = useAuth();

  useEffect(() => {
    if (location.state) {
      setPost(location.state.post);
      setMethod("PUT");
    }
  }, [location.state]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      const token = validateToken();
      if (!token) {
        setError("Invalid or expired token. Please log in again.");
        setLoading(false);
        return;
      }

      const url =
        method === "PUT"
          ? `${process.env.REACT_APP_BASE_URL}/posts/${post.id}`
          : `${process.env.REACT_APP_BASE_URL}/posts/`;

      try {
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: post.title,
            content: post.content,
          }),
        });

        if (!response.ok) {
          throw new Error(
            `Failed to ${method === "PUT" ? "update" : "create"} post.`
          );
        }
        if (method === "PUT") {
          navigate(`/post/${post.id}`);
        } else {
          navigate("/");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while saving the post.");
      } finally {
        setLoading(false);
      }
    },
    [method, post, validateToken, navigate]
  );

  return (
    <div>
      <Header />
      <Link to="/">Go Back</Link>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
        />
        <label htmlFor="content">Content:</label>
        <input
          type="text"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>

        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default PostForm;
