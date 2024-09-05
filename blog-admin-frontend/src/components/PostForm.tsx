import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Post } from "../types/Post";
import { isTokenExpired } from "../isTokenExpired";

const PostForm: React.FC = () => {
  const [post, setPost] = useState<Post>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.state.post);
    setPost(location.state.post);
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      location.state.onLogout();
      return;
    }

    const method = post ? "PUT" : "POST";
    const url = post
      ? `${process.env.REACT_APP_BASE_URL}/posts/${post.id}`
      : `${process.env.REACT_APP_BASE_URL}/posts/`;

    fetch(url, {
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

    navigate("/");
  };

  return (
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
      <button type="submit">Save</button>
    </form>
  );
};

export default PostForm;
