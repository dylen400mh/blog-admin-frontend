import React, { useCallback, useEffect, useState } from "react";
import { Post } from "../types/Post";
import { Comment } from "../types/Comment";
import { User } from "../types/User";
import Header from "./Header";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PostInfo: React.FC = () => {
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>("");
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const { validateToken } = useAuth();

  useEffect(() => {
    const token = validateToken();
    if (!token) {
      setError("Please log in again");
      return;
    }

    const fetchPostAndComments = async () => {
      try {
        const postResponse = fetch(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const commentsResponse = fetch(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}/comments`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const [postRes, commentsRes] = await Promise.all([
          postResponse,
          commentsResponse,
        ]);

        if (postRes.ok) {
          const postData = await postRes.json();
          setPost(postData.post);
        } else if (postRes.status === 404) {
          throw new Error("Post not found");
        }

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData.comments);

          const userIds = commentsData.comments.map(
            (comment: Comment) => comment.userId
          );
          fetchUsers(userIds);
        } else if (commentsRes.status === 404) {
          throw new Error("Comments not found");
        }

        setError("");
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching post and comments"
        );
      } finally {
        setLoadingPost(false);
        setLoadingComments(false);
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

    fetchPostAndComments();
  }, [id, validateToken]);

  const getUsername = useCallback(
    (userId: number) => {
      const user = users.find((user) => user.id === userId);
      return user ? user.username : "";
    },
    [users]
  );

  const togglePublish = useCallback(
    async (post: Post) => {
      const token = validateToken();

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
    },
    [validateToken]
  );

  const handleDeletePost = async (post: Post) => {
    const token = validateToken();

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
    const token = validateToken();

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

  if (loadingPost || loadingComments) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Header />
      <Link to="/">Go Back</Link>
      {post ? (
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
      ) : (
        <p>Post not found</p>
      )}
    </div>
  );
};

export default PostInfo;
