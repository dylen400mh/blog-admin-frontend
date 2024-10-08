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
    updatedAt: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const [method, setMethod] = useState("POST");
  const { validateToken } = useAuth();

  useEffect(() => {
    const token = validateToken();
    if (!token) {
      navigate("/");
      return;
    }

    if (location.state) {
      setPost(location.state.post);
      setMethod("PUT");
    }
  }, [location.state, validateToken, navigate]);

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
          if (response.status === 401) {
            throw new Error(`Error ${response.status}: Unauthorized`);
          }
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
      <div>
        <Header />
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/" className="text-indigo-600 hover:underline">
          Go Back
        </Link>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title:
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content:
          </label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            required
            rows={8}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PostForm;
