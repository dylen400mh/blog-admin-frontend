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
      <Header />
      <Link to={`/post/${comment.postId}`}>Go Back</Link>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Comment:</label>
        <input
          type="text"
          value={comment.content}
          onChange={(e) => setComment({ ...comment, content: e.target.value })}
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

export default CommentForm;
