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
      navigate("/");
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
        } else if (postRes.status === 401) {
          throw new Error(`Error ${postRes.status}: Unauthorized`);
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
        } else if (commentsRes.status === 401) {
          throw new Error(`Error ${commentsRes.status}: Unauthorized`);
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
      } else if (response.status === 401) {
        throw new Error(`Error ${response.status}: Unauthorized`);
      }
    };

    fetchPostAndComments();
  }, [id, validateToken, navigate]);

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
  console.log(comments);
  if (error) {
    return (
      <div>
        <Header />
        <p className="text-red-500 text-sm mt-4">{error}</p>
      </div>
    );
  }

  if (loadingPost || loadingComments) {
    return (
      <div>
        <Header />
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <Link to="/" className="text-indigo-600 hover:underline">
          Go Back
        </Link>
        {post ? (
          <div className="mt-6 space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              {post.title} -{" "}
              <span
                className={`${
                  post.isPublished ? "text-green-600" : "text-red-600"
                }`}
              >
                {post.isPublished ? "Published" : "Unpublished"}
              </span>
            </h2>
            <p className="text-gray-500">
              Created At: {new Date(post.createdAt).toLocaleString()}
            </p>
            <p className="text-gray-500">
              Last Edited: {new Date(post.updatedAt).toLocaleString()}
            </p>
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
            <div className="space-x-4">
              <Link
                to={"/post-form"}
                state={{ post }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                <button>Edit Post</button>
              </Link>
              <button
                onClick={() => handleDeletePost(post)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Delete Post
              </button>
              <button
                onClick={() => togglePublish(post)}
                className={`px-4 py-2 rounded-md text-white transition ${
                  post.isPublished
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {post.isPublished ? "Unpublish" : "Publish"}
              </button>
            </div>
            <h3 className="text-2xl font-semibold mt-8">Comments</h3>
            <ul className="space-y-4 mt-4">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="bg-white shadow-md rounded-md p-4 hover:bg-gray-50 transition"
                >
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    By: {getUsername(comment.userId)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created At: {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  <div className="space-x-4 mt-2">
                    <Link
                      to="/comment-form"
                      state={{ comment }}
                      className="text-blue-500 hover:underline"
                    >
                      <button>Edit Comment</button>
                    </Link>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete Comment
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-lg mt-4">Post not found</p>
        )}
      </div>
    </div>
  );
};

export default PostInfo;
