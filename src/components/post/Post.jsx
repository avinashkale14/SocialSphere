import "./post.scss";

import { Link } from "react-router-dom";

import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import Comments from "../comments/Comments";

import { useState } from "react";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);

  const liked = false;

  return (
    <article className="post">
      <div className="container">

        {/* POST HEADER */}
        <div className="user">

          <div className="userInfo">
            <img src={post.profilePic} alt={post.name} />

            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                className="profile-link"
              >
                <span className="name">{post.name}</span>
              </Link>

              <span className="date">1 min ago</span>
            </div>
          </div>

          <MoreHorizIcon className="more-icon" />
        </div>


        {/* POST CONTENT */}
        <div className="content">

          {post.desc && <p>{post.desc}</p>}

          {post.img && (
            <img
              src={post.img}
              alt="Post content"
            />
          )}

        </div>


        {/* POST ACTIONS */}
        <div className="info">

          <div className="item">
            {liked ? (
              <FavoriteOutlinedIcon />
            ) : (
              <FavoriteBorderOutlinedIcon />
            )}

            <span>12 Likes</span>
          </div>


          <div
            className="item"
            onClick={() => setCommentOpen(!commentOpen)}
          >
            <TextsmsOutlinedIcon />

            <span>12 Comments</span>
          </div>


          <div className="item">
            <ShareOutlinedIcon />

            <span>Share</span>
          </div>

        </div>


        {/* COMMENTS */}
        {commentOpen && <Comments />}

      </div>
    </article>
  );
};

export default Post;