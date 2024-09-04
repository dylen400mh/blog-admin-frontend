import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post } from "../types/Post";

const PostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post>({ title: "", content: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        .then((response) => response.json())
        .then((json) => setPost(json.post));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const method = id ? "PUT" : "POST";
    const url = id
      ? `${process.env.REACT_APP_BASE_URL}/posts/${id}`
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
  console.log(post)
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
