import React, { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";
import { User } from "../types/User";
import Header from "./Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isTokenExpired } from "../util/isTokenExpired";
import { useAuth } from "../contexts/AuthContext";

const PostInfo: React.FC = () => {
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);

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
        setPost(data.post);
      } else if (response.status === 404) {
        setError("Post not found");
        setPost(undefined);
      }
    };

    const fetchComments = async (postId: string | undefined) => {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/posts/${postId}/comments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);

        const userIds = data.comments.map((comment: Comment) => comment.userId);
        fetchUsers(userIds);
      } else if (response.status === 404) {
        setError("Post not found");
        setComments([]);
      }
    };

    const fetchUsers = async (userIds: number[]) => {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/users?ids=${userIds.join(",")}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    };

    fetchPost(id);
    fetchComments(id);
  }, [id]);

  const getUsername = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : "";
  };

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

  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      handleLogout();
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
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
          <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
          <p>{post.content}</p>
          <Link to={"/post-form"} state={{ post }}>
            <button>Edit Post</button>
          </Link>
          <button onClick={() => handleDeletePost(post)}>Delete Post</button>
          <button onClick={() => togglePublish(post)}>
            {post.isPublished ? "Unpublish" : "Publish"}
          </button>
          <h3>Comments</h3>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <p>{comment.content}</p>
                <p>By: {getUsername(comment.userId)}</p>
                <p>
                  Created At: {new Date(comment.createdAt).toLocaleString()}
                </p>
                <Link to="/comment-form" state={{ comment }}>
                  <button>Edit Comment</button>
                </Link>
                <button onClick={() => handleDeleteComment(comment.id)}>
                  Delete Comment
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostInfo;
