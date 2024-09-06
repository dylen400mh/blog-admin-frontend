import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Comment } from "../types/Comment";
import { isTokenExpired } from "../util/isTokenExpired";
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
  const navigate = useNavigate();
  const location = useLocation();
  const { validateToken } = useAuth();

  useEffect(() => {
    if (location.state) {
      setComment(location.state.comment);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = validateToken();

    fetch(`${process.env.REACT_APP_BASE_URL}/comments/${comment.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: comment.content,
      }),
    });

    navigate(`/post/${comment.postId}`);
  };

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Comment:</label>
        <input
          type="text"
          value={comment.content}
          onChange={(e) => setComment({ ...comment, content: e.target.value })}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default CommentForm;
