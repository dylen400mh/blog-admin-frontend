import React, { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { validateToken } = useAuth();

  // fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const token = validateToken();
      if (!token) {
        setError("Please login again");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/posts`,
          {
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch posts`);
        }

        const data = await response.json();
        setPosts(data.posts || []);
        setError("");
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [validateToken]);

  if (error) {
    return <p>Error fetching posts: {error}</p>;
  }

  if (loading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div>
      <h2>Posts</h2>
      <Link to={"/post-form"}>
        <button>New Post</button>
      </Link>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul>
          {loading ? (
            <p>Loading...</p>
          ) : (
            posts.map((post) => (
              <Link to={`/post/${post.id}`}>
                <li key={post.id}>
                  {post.title} -{" "}
                  {post.isPublished ? "Published" : "Unpublished"}
                </li>
              </Link>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default PostList;
