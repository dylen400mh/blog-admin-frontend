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
    return (
      <p className="text-red-500 text-sm mt-4">Error fetching posts: {error}</p>
    );
  }

  if (loading) {
    return <p className="text-gray-600 mt-4">Loading posts...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Posts</h2>
        <Link to={"/post-form"}>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 transition duration-200">
            New Post
          </button>
        </Link>
      </div>
      <div className="flex flex-col items-center space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-lg">No posts available</p>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              to={`/post/${post.id}`}
              className="block w-full max-w-md bg-white shadow-md rounded-md p-4 hover:bg-gray-50 transition duration-200"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">
                  {post.title}
                </span>
                <span
                  className={`text-sm ${
                    post.isPublished ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {post.isPublished ? "Published" : "Unpublished"}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default PostList;
