import "./rightbar.scss";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

import { AuthContext } from "../../context/authContext";
import makeRequest from "../../axios";
import getImageUrl from "../../utils/imageUrl";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ======================================================
  // GET USERS / SUGGESTIONS
  // ======================================================

  const {
    isLoading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery({
    queryKey: ["rightbarUsers"],

    queryFn: async () => {
      const res = await makeRequest.get("/users");

      return res.data;
    },

    enabled: !!currentUser,
  });

  // ======================================================
  // GET LATEST ACTIVITIES
  // ======================================================

  const {
    isLoading: activitiesLoading,
    error: activitiesError,
    data: activitiesData,
  } = useQuery({
    queryKey: ["activities"],

    queryFn: async () => {
      const res = await makeRequest.get("/activities");

      return res.data;
    },

    enabled: !!currentUser,

    // Refresh every 30 seconds
    refetchInterval: 30000,
  });

  // ======================================================
  // GET TRENDING POSTS
  // ======================================================

  const {
    isLoading: trendingLoading,
    error: trendingError,
    data: trendingData,
  } = useQuery({
    queryKey: ["trendingPosts"],

    queryFn: async () => {
      const res = await makeRequest.get("/trending");

      return res.data;
    },

    enabled: !!currentUser,

    // Refresh every 30 seconds
    refetchInterval: 30000,
  });

  // ======================================================
  // FOLLOW USER
  // ======================================================

  const followMutation = useMutation({
    mutationFn: async (userId) => {
      return makeRequest.post("/relationships", {
        userId,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rightbarUsers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      queryClient.invalidateQueries({
        queryKey: ["trendingPosts"],
      });
    },

    onError: (error) => {
      console.log(
        "FOLLOW ERROR:",
        error.response?.data || error.message
      );
    },
  });

  // ======================================================
  // UNFOLLOW USER
  // ======================================================

  const unfollowMutation = useMutation({
    mutationFn: async (userId) => {
      return makeRequest.delete(
        `/relationships?userId=${userId}`
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["rightbarUsers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["activities"],
      });

      queryClient.invalidateQueries({
        queryKey: ["trendingPosts"],
      });
    },

    onError: (error) => {
      console.log(
        "UNFOLLOW ERROR:",
        error.response?.data || error.message
      );
    },
  });

  // ======================================================
  // HANDLE FOLLOW / UNFOLLOW
  // ======================================================

  const handleFollow = (person) => {
    if (!person?.id) {
      return;
    }

    if (person.following) {
      unfollowMutation.mutate(person.id);
    } else {
      followMutation.mutate(person.id);
    }
  };

  // ======================================================
  // RELATIVE TIME
  // ======================================================

  const getRelativeTime = (date) => {
    if (!date) {
      return "";
    }

    const activityDate = new Date(date);
    const now = new Date();

    const diff =
      now.getTime() -
      activityDate.getTime();

    const seconds = Math.floor(diff / 1000);

    if (seconds < 10) {
      return "Just now";
    }

    if (seconds < 60) {
      return `${seconds}s ago`;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    const weeks = Math.floor(days / 7);

    if (weeks < 4) {
      return `${weeks}w ago`;
    }

    return activityDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ======================================================
  // ACTIVITY ICON
  // ONLY 4 ACTIVITIES
  // ======================================================

  const getActivityIcon = (type) => {
    switch (type) {
      case "follow":
        return "👥";

      case "post":
        return "📝";

      case "story":
        return "📸";

      case "comment":
        return "💬";

      default:
        return "•";
    }
  };

  // ======================================================
  // DATA
  // ======================================================

  const suggestions =
    usersData || [];

  const activities =
    activitiesData || [];

  const trendingPosts =
    trendingData || [];

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <aside className="rightBar">

      {/* ==================================================
          SUGGESTIONS
          EXISTING UI - KEPT SAME
      ================================================== */}

      <section className="rightCard suggestionsCard">

        <div className="cardHeader">

          <div>
            <h3>
              Suggestions For You
            </h3>

            <span className="cardSubtitle">
              People you may know
            </span>
          </div>

          {suggestions.length > 0 && (
            <span className="seeAllButton">
              {suggestions.length === 1
                ? "1 Person"
                : `${suggestions.length} People`}
            </span>
          )}

        </div>

        {/* Loading */}

        {usersLoading && (
          <div className="emptyState">

            <div className="emptyIcon">
              ⏳
            </div>

            <span>
              Loading suggestions...
            </span>

          </div>
        )}

        {/* Error */}

        {usersError && (
          <div className="emptyState">

            <div className="emptyIcon">
              ⚠️
            </div>

            <span>
              Unable to load suggestions
            </span>

          </div>
        )}

        {/* Empty */}

        {!usersLoading &&
          !usersError &&
          suggestions.length === 0 && (
            <div className="emptyState">

              <div className="emptyIcon">
                👥
              </div>

              <span>
                No more suggestions
              </span>

            </div>
          )}

        {/* Suggestions List */}

        {!usersLoading &&
          !usersError &&
          suggestions.length > 0 && (

            <div className="suggestionList">

              {suggestions
                .slice(0, 4)
                .map((person) => (

                  <div
                    className="suggestionItem"
                    key={person.id}
                  >

                    <img
                      src={
                        getImageUrl(
                          person.profilePic
                        ) ||
                        "https://i.pravatar.cc/150?img=12"
                      }
                      alt={
                        person.name ||
                        person.username ||
                        "User"
                      }
                      onClick={() =>
                        navigate(
                          `/profile/${person.id}`
                        )
                      }
                    />

                    <div
                      className="suggestionInfo"
                      onClick={() =>
                        navigate(
                          `/profile/${person.id}`
                        )
                      }
                    >

                      <strong
                        title={
                          person.name ||
                          person.username
                        }
                      >
                        {person.name ||
                          person.username ||
                          "User"}
                      </strong>

                      <span>
                        {person.city ||
                          (person.following
                            ? "Following"
                            : "Suggested for you")}
                      </span>

                    </div>

                    <button
                      type="button"
                      className={`followButton ${
                        person.following
                          ? "following"
                          : ""
                      }`}
                      onClick={() =>
                        handleFollow(person)
                      }
                      disabled={
                        followMutation.isPending ||
                        unfollowMutation.isPending
                      }
                    >
                      {person.following
                        ? "Following"
                        : "Follow"}
                    </button>

                  </div>

                ))}

            </div>

          )}

      </section>


      {/* ==================================================
          LATEST ACTIVITIES
          EXISTING UI - KEPT SAME
      ================================================== */}

      <section className="rightCard">

        <div className="cardHeader">

          <div>
            <h3>
              Latest Activities
            </h3>

            <span className="cardSubtitle">
              Recent updates
            </span>
          </div>

        </div>

        {/* Loading */}

        {activitiesLoading && (
          <div className="emptyState">

            <div className="emptyIcon">
              ⏳
            </div>

            <span>
              Loading activities...
            </span>

          </div>
        )}

        {/* Error */}

        {activitiesError && (
          <div className="emptyState">

            <div className="emptyIcon">
              ⚠️
            </div>

            <span>
              Unable to load activities
            </span>

          </div>
        )}

        {/* No Activities */}

        {!activitiesLoading &&
          !activitiesError &&
          activities.length === 0 && (
            <div className="emptyState">

              <div className="emptyIcon">
                ✦
              </div>

              <span>
                No recent activities
              </span>

            </div>
          )}

        {/* Activities */}

        {!activitiesLoading &&
          !activitiesError &&
          activities.length > 0 && (

            <div className="activityList">

              {activities
                .slice(0, 5)
                .map((activity) => (

                  <div
                    className="activityItem"
                    key={`${activity.activityType}-${activity.activityId}`}
                  >

                    <div className="activityAvatar">

                      <img
                        src={
                          getImageUrl(
                            activity.profilePic
                          ) ||
                          "https://i.pravatar.cc/150?img=12"
                        }
                        alt={
                          activity.name ||
                          "User"
                        }
                      />

                      <span className="activityBadge">
                        {getActivityIcon(
                          activity.activityType
                        )}
                      </span>

                    </div>

                    <div className="activityInfo">

                      <strong>
                        {activity.activityText}
                      </strong>

                      <span>
                        {getRelativeTime(
                          activity.activityTime
                        )}
                      </span>

                    </div>

                  </div>

                ))}

            </div>

          )}

      </section>


      {/* ==================================================
          TRENDING POSTS
          NEW FEATURE
      ================================================== */}

      <section className="rightCard trendingCard">

        <div className="cardHeader">

          <div className="trendingTitleWrapper">

            <div className="trendingTitleIcon">
              <TrendingUpOutlinedIcon />
            </div>

            <div>
              <h3>
                Trending Posts
              </h3>

              <span className="cardSubtitle">
                Popular right now
              </span>
            </div>

          </div>

        </div>


        {/* Loading */}

        {trendingLoading && (
          <div className="emptyState">

            <div className="emptyIcon">
              ⏳
            </div>

            <span>
              Loading trending posts...
            </span>

          </div>
        )}


        {/* Error */}

        {trendingError && (
          <div className="emptyState">

            <div className="emptyIcon">
              ⚠️
            </div>

            <span>
              Unable to load trending posts
            </span>

          </div>
        )}


        {/* Empty */}

        {!trendingLoading &&
          !trendingError &&
          trendingPosts.length === 0 && (

            <div className="emptyState">

              <div className="emptyIcon">
                📈
              </div>

              <span>
                No trending posts yet
              </span>

            </div>

          )}


        {/* Trending Posts */}

        {!trendingLoading &&
          !trendingError &&
          trendingPosts.length > 0 && (

            <div className="trendingList">

              {trendingPosts
                .slice(0, 5)
                .map((post, index) => (

                  <div
                    className="trendingItem"
                    key={post.id}
                    onClick={() =>
                      navigate(
                        `/profile/${post.userId}`
                      )
                    }
                  >

                    {/* Rank */}

                    <div className="trendingRank">
                      {index + 1}
                    </div>


                    <div className="trendingContent">

                      {/* Author */}

                      <div className="trendingAuthor">

                        <img
                          src={
                            getImageUrl(
                              post.profilePic
                            ) ||
                            "https://i.pravatar.cc/150?img=12"
                          }
                          alt={
                            post.name ||
                            "User"
                          }
                        />

                        <div>

                          <strong>
                            {post.name ||
                              post.username ||
                              "User"}
                          </strong>

                          <span>
                            @{post.username ||
                              "user"}
                          </span>

                        </div>

                      </div>


                      {/* Post Image */}

                      {post.img && (
                        <img
                          className="trendingPostImage"
                          src={getImageUrl(post.img)}
                          alt="Trending post"
                        />
                      )}


                      {/* Post Video */}

                      {!post.img &&
                        post.video && (
                          <video
                            className="trendingPostImage"
                            src={getImageUrl(post.video)}
                            muted
                            playsInline
                          />
                        )}


                      {/* Description */}

                      <p className="trendingDescription">

                        {post.desc
                          ? post.desc.length > 80
                            ? `${post.desc.substring(
                                0,
                                80
                              )}...`
                            : post.desc
                          : "Shared a new post"}

                      </p>


                      {/* Stats */}

                      <div className="trendingStats">

                        <span>
                          <FavoriteBorderOutlinedIcon />

                          {Number(
                            post.likesCount || 0
                          )}
                        </span>

                        <span>
                          <CommentOutlinedIcon />

                          {Number(
                            post.commentsCount || 0
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

            </div>

          )}

      </section>

    </aside>
  );
};

export default RightBar;