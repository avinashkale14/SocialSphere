import "./comments.scss";

import {
  useContext,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import DeleteIcon from "@mui/icons-material/Delete";

import { AuthContext } from "../../context/authContext";
import makeRequest from "../../axios";
import getImageUrl, {
  getAvatarPlaceholder,
} from "../../utils/imageUrl";

// Time ago
const timeAgo = (date) => {
  if (!date) {
    return "Just now";
  }

  const now = new Date();
  const past = new Date(date);

  const seconds = Math.floor(
    (now - past) / 1000
  );

  if (seconds < 10) {
    return "Just now";
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours}h`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days}d`;
  }

  const weeks = Math.floor(
    days / 7
  );

  if (weeks < 4) {
    return `${weeks}w`;
  }

  const months = Math.floor(
    days / 30
  );

  if (months < 12) {
    return `${months}mo`;
  }

  return `${Math.floor(
    days / 365
  )}y`;
};

const Comments = ({
  postId,
}) => {
  const {
    currentUser,
  } = useContext(AuthContext);

  const queryClient =
    useQueryClient();

  const [
    desc,
    setDesc,
  ] = useState("");

  // Get comments
  const {
    data: comments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "comments",
      postId,
    ],

    queryFn: () =>
      makeRequest
        .get(
          `/comments?postId=${postId}`
        )
        .then(
          (res) =>
            Array.isArray(res.data)
              ? res.data
              : []
        ),

    enabled:
      !!postId,
  });

  // Add comment
  const addCommentMutation =
    useMutation({
      mutationFn: () =>
        makeRequest.post(
          "/comments",
          {
            desc: desc.trim(),
            postId: postId,
          }
        ),

      onSuccess: () => {
        setDesc("");

        queryClient.invalidateQueries({
          queryKey: [
            "comments",
            postId,
          ],
        });
      },

      onError: (error) => {
        console.log(
          "ADD COMMENT ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data ||
            "Unable to add comment."
        );
      },
    });

  // Delete comment
  const deleteCommentMutation =
    useMutation({
      mutationFn: (commentId) =>
        makeRequest.delete(
          `/comments/${commentId}`
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "comments",
            postId,
          ],
        });
      },

      onError: (error) => {
        console.log(
          "DELETE COMMENT ERROR:",
          error.response?.data ||
            error.message
        );

        alert(
          error.response?.data ||
            "Unable to delete comment."
        );
      },
    });

  // Submit comment
  const handleSubmit = (event) => {
    event.preventDefault();

    const text =
      desc.trim();

    if (!text) {
      return;
    }

    if (
      addCommentMutation.isPending
    ) {
      return;
    }

    addCommentMutation.mutate();
  };

  // Delete
  const handleDelete = (
    commentId
  ) => {
    const confirmed =
      window.confirm(
        "Delete this comment?"
      );

    if (!confirmed) {
      return;
    }

    deleteCommentMutation.mutate(
      commentId
    );
  };

  // Profile image
  const getProfileImage = (
    comment
  ) => {
    if (!comment?.profilePic) {
      return getAvatarPlaceholder(
        comment?.name || "User"
      );
    }

    return (
      getImageUrl(
        comment.profilePic
      ) ||
      getAvatarPlaceholder(
        comment?.name || "User"
      )
    );
  };

  // Loading
  if (isLoading) {
    return (
      <div className="commentsBox">
        <div className="commentsLoading">
          Loading comments...
        </div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="commentsBox">
        <div className="commentsError">
          Unable to load comments.
        </div>
      </div>
    );
  }

  return (
    <div className="commentsBox">
      <form
        className="commentInput"
        onSubmit={handleSubmit}
      >
        <img
          src={
            getImageUrl(
              currentUser?.profilePic
            ) ||
            getAvatarPlaceholder(
              currentUser?.name ||
                "You"
            )
          }
          alt="You"
        />

        <input
          type="text"
          value={desc}
          onChange={(event) =>
            setDesc(
              event.target.value
            )
          }
          placeholder="Write a comment..."
          maxLength={200}
        />

        <button
          type="submit"
          disabled={
            !desc.trim() ||
            addCommentMutation.isPending
          }
        >
          {addCommentMutation.isPending
            ? "..."
            : "Send"}
        </button>
      </form>

      <div className="commentList">
        {comments.length === 0 ? (
          <div className="noComments">
            No comments yet. Be the first to comment.
          </div>
        ) : (
          comments.map(
            (comment) => {
              const canDelete =
                currentUser &&
                Number(
                  currentUser.id
                ) ===
                  Number(
                    comment.userId
                  );

              return (
                <div
                  className="comment"
                  key={comment.id}
                >
                  <img
                    src={getProfileImage(
                      comment
                    )}
                    alt={
                      comment.name ||
                      "User"
                    }
                  />

                  <div className="commentBody">
                    <div className="commentTop">
                      <div className="commentAuthor">
                        <span className="commentName">
                          {comment.name ||
                            "User"}
                        </span>

                        <span className="commentTime">
                          {timeAgo(
                            comment.createdAt
                          )}
                        </span>
                      </div>

                      {canDelete && (
                        <button
                          type="button"
                          className="deleteComment"
                          onClick={() =>
                            handleDelete(
                              comment.id
                            )
                          }
                          disabled={
                            deleteCommentMutation.isPending
                          }
                          title="Delete comment"
                        >
                          <DeleteIcon />
                        </button>
                      )}
                    </div>

                    <p>
                      {comment.desc}
                    </p>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
};

export default Comments;