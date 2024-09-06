import React, { useEffect, useState } from "react";
import { Post } from "../types/Post";
import Header from "./Header";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { isTokenExpired } from "../util/isTokenExpired";
import { useAuth } from "../contexts/AuthContext";

const PostInfo: React.FC = () => {
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { handleLogout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      handleLogout();
      return;
    }

    const fetchPost = async (postId: string | undefined) => {
      console.log(`${process.env.REACT_APP_BASE_URL}/posts/${postId}`);
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/posts/${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setPost(data.post);
      } else if (response.status === 404) {
        setError("Post not found");
        setPost(undefined);
      }
    };

    fetchPost(id);
  }, [id]);

  const togglePublish = async (post: Post) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/posts/${post.id}`,
      {
        mode: "cors",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          isPublished: !post.isPublished,
        }),
      }
    );

    if (response.ok) {
      setPost({ ...post, isPublished: !post.isPublished });
    }
  };

  const handleDeletePost = async (post: Post) => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      handleLogout();
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/posts/${post.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      navigate("/");
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Header />
      {!post ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>
            {post.title} - {post.isPublished ? "Published" : "Unpublished"}
          </h2>
          <p>{post.createdAt}</p>
          <p>{post.content}</p>
          <Link to={"/post-form"} state={{ post }}>
            <button>Edit Post</button>
          </Link>
          <button onClick={() => handleDeletePost(post)}>Delete Post</button>
          <button onClick={() => togglePublish(post)}>
            {post.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostInfo;
