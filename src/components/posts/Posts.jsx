import "./posts.scss";
import Post from "../post/Post";

import { useQuery } from "@tanstack/react-query";
import makeRequest from "../../axios";

const Posts = ({ userId }) => {
  const {
    isLoading,
    error,
    data,
  } = useQuery({
    queryKey: userId
      ? ["posts", userId]
      : ["posts"],

    queryFn: async () => {
      const res = await makeRequest.get(
        "/posts",
        {
          params: userId
            ? { userId }
            : {},
        }
      );

      return res.data;
    },
  });

  // Loading
  if (isLoading) {
    return (
      <div className="postsMessage">
        Loading posts...
      </div>
    );
  }

  // Error
  if (error) {
    console.log(
      "POSTS ERROR:",
      error.response?.data ||
        error.message
    );

    return (
      <div className="postsMessage">
        Something went wrong while loading posts!
      </div>
    );
  }

  // No posts
  if (!data || data.length === 0) {
    return (
      <div className="postsMessage">
        {userId
          ? "No posts yet."
          : "No posts available."}
      </div>
    );
  }

  return (
    <div className="posts">
      {data.map((post) => (
        <Post
          post={post}
          key={post.id}
        />
      ))}
    </div>
  );
};

export default Posts;