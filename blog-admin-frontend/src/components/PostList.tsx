import React, { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { Link } from "react-router-dom";
import { isTokenExpired } from "../util/isTokenExpired";
import { useAuth } from "../contexts/AuthContext";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { validateToken } = useAuth();

  // fetch posts
  useEffect(() => {
    const token = validateToken();

    fetch(`${process.env.REACT_APP_BASE_URL}/posts`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setPosts(json.posts);
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [validateToken]);

  return (
    <div>
      <h2>Posts</h2>
      <Link to={"/post-form"}>
        <button>New Post</button>
      </Link>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : (
          posts.map((post) => (
            <Link to={`/post/${post.id}`}>
              <li key={post.id}>
                {post.title} - {post.isPublished ? "Published" : "Unpublished"}
              </li>
            </Link>
          ))
        )}
      </ul>
      {error && <p>Error fetching posts: {error}</p>}
    </div>
  );
};

export default PostList;
