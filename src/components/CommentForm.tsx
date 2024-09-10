import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Comment } from "../types/Comment";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";

const CommentForm: React.FC = () => {
  const [comment, setComment] = useState<Comment>({
    id: 0,
    content: "",
    postId: 0,
    userId: 0,
    createdAt: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const { validateToken } = useAuth();

  useEffect(() => {
    const token = validateToken();
    if (!token) {
      setError("Please log in again");
      return;
    }

    if (location.state && location.state.comment) {
      setComment(location.state.comment);
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

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/comments/${comment.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              content: comment.content,
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(`Error ${response.status}: Unauthorized`);
          }
          throw new Error("Failed to update comment");
        }

        navigate(`/post/${comment.postId}`);
      } catch (err: any) {
        setError(err.message || "An error occurred while saving the comment.");
      } finally {
        setLoading(false);
      }
    },
    [comment, validateToken, navigate]
  );

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <Link
          to={`/post/${comment.postId}`}
          className="text-indigo-600 hover:underline"
        >
          Go Back
        </Link>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Comment:
          </label>
          <textarea
            rows={8}
            value={comment.content}
            onChange={(e) =>
              setComment({ ...comment, content: e.target.value })
            }
            required
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

export default CommentForm;
