import "./post.scss";

import {
  useContext,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

import { AuthContext } from "../../context/authContext";
import makeRequest from "../../axios";
import Comments from "../comments/Comments";
import getImageUrl, {
  getAvatarPlaceholder,
} from "../../utils/imageUrl";

// Time ago

const timeAgo = (date) => {
  if (!date) return "Just now";

  const now = new Date();
  const past = new Date(date);

  const seconds = Math.floor(
    (now - past) / 1000
  );

  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds} sec ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks < 4) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  const years = Math.floor(days / 365);

  return `${years} year${years > 1 ? "s" : ""} ago`;
};

// Post

const Post = ({ post }) => {
  const { currentUser } =
    useContext(AuthContext);

  const queryClient =
    useQueryClient();

  // States

  const [commentOpen, setCommentOpen] =
    useState(false);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [editDesc, setEditDesc] =
    useState(post?.desc || "");

  // Profile image

  const profilePic =
    getImageUrl(post?.profilePic) ||
    getAvatarPlaceholder(post?.name);

  // Post image

  const imageUrl =
    getImageUrl(post?.img);

  // Post video

  const videoUrl =
    getImageUrl(post?.video);

  const isValidVideo =
    !!videoUrl &&
    /\.(mp4|webm|ogg|mov|m4v)$/i.test(
      videoUrl
    );

  const shouldShowVideo =
    !imageUrl && isValidVideo;

  // Owner

  const isOwner =
    currentUser &&
    Number(currentUser.id) ===
      Number(post?.userId);

  // Get likes

  const {
    data: likes = [],
  } = useQuery({
    queryKey: [
      "likes",
      post?.id,
    ],

    queryFn: () =>
      makeRequest
        .get(
          `/likes?postId=${post.id}`
        )
        .then((res) =>
          Array.isArray(res.data)
            ? res.data
            : []
        ),

    enabled:
      !!post?.id &&
      !!currentUser,
  });

  // Current user liked

  const liked =
    likes.some(
      (like) =>
        Number(like.userId) ===
        Number(currentUser?.id)
    );

  // Get comments

  const {
    data: comments = [],
  } = useQuery({
    queryKey: [
      "comments",
      post?.id,
    ],

    queryFn: () =>
      makeRequest
        .get(
          `/comments?postId=${post.id}`
        )
        .then((res) =>
          Array.isArray(res.data)
            ? res.data
            : []
        ),

    enabled: !!post?.id,
  });

  // Like / unlike

  const likeMutation =
    useMutation({

      mutationFn: () => {

        if (liked) {
          return makeRequest.delete(
            `/likes?postId=${post.id}`
          );
        }

        return makeRequest.post(
          "/likes",
          {
            postId: post.id,
          }
        );
      },

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: [
            "likes",
            post.id,
          ],
        });

      },

      onError: (error) => {

        console.log(
          "LIKE ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data ||
            "Unable to update like."
        );
      },
    });

  // Handle like

  const handleLike = () => {

    if (!currentUser) {

      alert(
        "Please login to like this post."
      );

      return;
    }

    if (likeMutation.isPending) {
      return;
    }

    likeMutation.mutate();
  };

  // Delete post

  const deleteMutation =
    useMutation({

      mutationFn: () =>
        makeRequest.delete(
          `/posts/${post.id}`
        ),

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });

        setMenuOpen(false);
      },

      onError: (error) => {

        console.log(
          "DELETE POST ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data ||
            "Unable to delete post."
        );
      },
    });

  // Handle delete

  const handleDelete = () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmDelete) {
      return;
    }

    deleteMutation.mutate();
  };

  // Edit post

  const editMutation =
    useMutation({

      mutationFn: () =>
        makeRequest.put(
          `/posts/${post.id}`,
          {
            desc: editDesc.trim(),
          }
        ),

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });

        setEditing(false);
        setMenuOpen(false);
      },

      onError: (error) => {

        console.log(
          "EDIT POST ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data ||
            "Unable to edit post."
        );
      },
    });

  // Handle edit

  const handleEdit = () => {

    setEditDesc(
      post?.desc || ""
    );

    setEditing(true);
    setMenuOpen(false);
  };

  // Save edit

  const saveEdit = () => {

    const text =
      editDesc.trim();

    if (!text) {

      alert(
        "Post cannot be empty."
      );

      return;
    }

    editMutation.mutate();
  };

  // Copy link

  const handleCopyLink =
    async () => {

      const postLink =
        `${window.location.origin}/post/${post.id}`;

      try {

        await navigator.clipboard.writeText(
          postLink
        );

        alert(
          "Post link copied!"
        );

        setMenuOpen(false);

      } catch (error) {

        console.log(
          "COPY LINK ERROR:",
          error
        );

        alert(
          "Unable to copy link."
        );
      }
    };

  // Share

  const handleShare =
    async () => {

      const postLink =
        `${window.location.origin}/post/${post.id}`;

      try {

        if (navigator.share) {

          await navigator.share({
            title: "SocialSphere",

            text:
              post?.desc ||
              "Check out this post!",

            url: postLink,
          });

        } else {

          await navigator.clipboard.writeText(
            postLink
          );

          alert(
            "Post link copied!"
          );
        }

      } catch (error) {

        if (
          error?.name !==
          "AbortError"
        ) {

          console.log(
            "SHARE ERROR:",
            error
          );
        }
      }
    };

  // Close menu outside

  useEffect(() => {

    const handleOutsideClick =
      (event) => {

        if (
          !event.target.closest(
            ".postMenu"
          )
        ) {

          setMenuOpen(false);
        }
      };

    document.addEventListener(
      "click",
      handleOutsideClick
    );

    return () => {

      document.removeEventListener(
        "click",
        handleOutsideClick
      );

    };

  }, []);

  // Comments

  const toggleComments = () => {

    setCommentOpen(
      (prev) => !prev
    );

  };

  // Render

  return (

    <div className="post">

      <div className="container">

        {}

        <div className="user">

          <div className="userInfo">

            <img
              src={profilePic}
              alt="Profile"
            />

            <div className="details">

              <Link
                to={`/profile/${post.userId}`}
                className="profile-link"
              >

                <span className="name">
                  {post?.name ||
                    "User"}
                </span>

              </Link>

              <span className="date">
                {timeAgo(
                  post?.createdAt
                )}
              </span>

            </div>

          </div>

          {}

          <div className="postMenu">

            <button
              type="button"
              className="moreButton"
              onClick={(event) => {

                event.stopPropagation();

                setMenuOpen(
                  (prev) => !prev
                );

              }}
            >

              <MoreHorizIcon />

            </button>

            {menuOpen && (

              <div className="menu">

                {isOwner && (
                  <>

                    <button
                      type="button"
                      onClick={handleEdit}
                    >

                      <EditOutlinedIcon />

                      <span>
                        Edit
                      </span>

                    </button>

                    <button
                      type="button"
                      onClick={
                        handleCopyLink
                      }
                    >

                      <ContentCopyOutlinedIcon />

                      <span>
                        Copy Link
                      </span>

                    </button>

                    <button
                      type="button"
                      className="deleteButton"
                      onClick={
                        handleDelete
                      }
                      disabled={
                        deleteMutation.isPending
                      }
                    >

                      <DeleteOutlineOutlinedIcon />

                      <span>
                        {deleteMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </span>

                    </button>

                  </>
                )}

                {!isOwner && (

                  <button
                    type="button"
                    onClick={
                      handleCopyLink
                    }
                  >

                    <ContentCopyOutlinedIcon />

                    <span>
                      Copy Link
                    </span>

                  </button>

                )}

              </div>

            )}

          </div>

        </div>

        {}

        <div className="content">

          {}

          {editing ? (

            <div className="editArea">

              <textarea
                value={editDesc}
                onChange={(e) =>
                  setEditDesc(
                    e.target.value
                  )
                }
                autoFocus
              />

              <div className="editActions">

                <button
                  type="button"
                  className="cancelEdit"
                  onClick={() =>
                    setEditing(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="saveEdit"
                  onClick={saveEdit}
                  disabled={
                    editMutation.isPending
                  }
                >

                  {editMutation.isPending
                    ? "Saving..."
                    : "Save"}

                </button>

              </div>

            </div>

          ) : (

            post?.desc && (

              <p className="description">
                {post.desc}
              </p>

            )

          )}

          {}

          {(post?.location ||
            post?.feeling) && (

            <div className="postMeta">

              {post?.location && (

                <span className="locationTag">

                  <span className="metaIcon">
                    📍
                  </span>

                  {post.location}

                </span>

              )}

              {post?.feeling && (

                <span className="feelingTag">

                  {post.feeling}

                </span>

              )}

            </div>

          )}

          {}

          {imageUrl && (

            <div className="postMedia">

              <img
                src={imageUrl}
                alt="Post"
              />

            </div>

          )}

          {}

          {shouldShowVideo && (

            <div className="postMedia videoMedia">

              <video
                src={videoUrl}
                controls
                preload="metadata"
                playsInline
              />

            </div>

          )}

        </div>

        {}

        <div className="info">

          {}

          <button
            type="button"
            className={`item likeItem ${
              liked ? "liked" : ""
            }`}
            onClick={handleLike}
            disabled={
              likeMutation.isPending
            }
          >

            {liked ? (

              <FavoriteOutlinedIcon />

            ) : (

              <FavoriteBorderOutlinedIcon />

            )}

            <span>
              {liked
                ? "Liked"
                : "Like"}
            </span>

            {likes.length > 0 && (

              <span className="likeCount">
                {likes.length}
              </span>

            )}

          </button>

          {}

          <button
            type="button"
            className={`item commentItem ${
              commentOpen
                ? "active"
                : ""
            }`}
            onClick={
              toggleComments
            }
          >

            <TextsmsOutlinedIcon />

            <span>
              Comments
            </span>

            {comments.length > 0 && (

              <span className="commentCount">
                {comments.length}
              </span>

            )}

          </button>

          {}

          <button
            type="button"
            className="item"
            onClick={
              handleShare
            }
          >

            <ShareOutlinedIcon />

            <span>
              Share
            </span>

          </button>

        </div>

        {}

        {commentOpen && (

          <div className="comments">

            <Comments
              postId={post.id}
            />

          </div>

        )}

      </div>

    </div>
  );
};

export default Post;
