import React, { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { Link } from "react-router-dom";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // fetch posts
  useEffect(() => {
    const token = localStorage.getItem("token");
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
  }, []);

  const togglePublish = async (post: Post) => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.REACT_APP_BASE_URL}/posts/${post.id}`, {
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
    });

    setPosts(
      posts.map((p) =>
        p.id === post.id ? { ...p, isPublished: !post.isPublished } : p
      )
    );
  };

  return (
    <div>
      <h2>Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}/edit`}>
              <h3>
                {post.title} - {post.isPublished ? "Published" : "Unpublished"}
              </h3>
            </Link>
            <button onClick={() => togglePublish(post)}>
              {post.isPublished ? "Unpublish" : "Publish"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
