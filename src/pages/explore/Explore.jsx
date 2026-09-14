import "./explore.scss";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

import { AuthContext } from "../../context/authContext";
import makeRequest from "../../axios";
import getImageUrl from "../../utils/imageUrl";


const Explore = () => {

  const { currentUser } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const queryClient =
    useQueryClient();


  /* =====================================================
     USERS
  ===================================================== */

  const {
    isLoading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery({

    queryKey: ["exploreUsers"],

    queryFn: async () => {

      const res =
        await makeRequest.get("/users");

      return res.data;
    },

    enabled: !!currentUser,

  });


  /* =====================================================
     ACTIVITIES
  ===================================================== */

  const {
    isLoading: activitiesLoading,
    error: activitiesError,
    data: activitiesData,
  } = useQuery({

    queryKey: ["exploreActivities"],

    queryFn: async () => {

      const res =
        await makeRequest.get("/activities");

      return res.data;
    },

    enabled: !!currentUser,

  });


  /* =====================================================
     TRENDING POSTS
  ===================================================== */

  const {
    isLoading: trendingLoading,
    error: trendingError,
    data: trendingData,
  } = useQuery({

    queryKey: ["trendingPosts"],

    queryFn: async () => {

      const res =
        await makeRequest.get("/trending");

      return res.data;
    },

    enabled: !!currentUser,

    refetchInterval: 30000,

  });


  /* =====================================================
     FOLLOW / UNFOLLOW
  ===================================================== */

  const followMutation =
    useMutation({

      mutationFn: async ({
        userId,
        following,
      }) => {

        if (following) {

          return makeRequest.delete(
            `/relationships?userId=${userId}`
          );

        }

        return makeRequest.post(
          "/relationships",
          {
            userId,
          }
        );

      },

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: ["exploreUsers"],
        });

        queryClient.invalidateQueries({
          queryKey: ["rightbarUsers"],
        });

        queryClient.invalidateQueries({
          queryKey: ["activities"],
        });

        queryClient.invalidateQueries({
          queryKey: ["exploreActivities"],
        });

        queryClient.invalidateQueries({
          queryKey: ["trendingPosts"],
        });

      },

    });


  /* =====================================================
     TIME
  ===================================================== */

  const getRelativeTime = (date) => {

    if (!date) {
      return "";
    }

    const activityDate =
      new Date(date);

    const now =
      new Date();

    const seconds =
      Math.floor(
        (now - activityDate) /
        1000
      );


    if (seconds < 10) {
      return "Just now";
    }


    if (seconds < 60) {
      return `${seconds}s ago`;
    }


    const minutes =
      Math.floor(seconds / 60);


    if (minutes < 60) {
      return `${minutes}m ago`;
    }


    const hours =
      Math.floor(minutes / 60);


    if (hours < 24) {
      return `${hours}h ago`;
    }


    const days =
      Math.floor(hours / 24);


    if (days < 7) {
      return `${days}d ago`;
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


  /* =====================================================
     ACTIVITY ICON
  ===================================================== */

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


  /* =====================================================
     DATA
  ===================================================== */

  const suggestions =
    Array.isArray(usersData)
      ? usersData
      : [];


  const activities =
    Array.isArray(activitiesData)
      ? activitiesData
      : [];


  const trendingPosts =
    Array.isArray(trendingData)
      ? trendingData
      : [];


  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="explore-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="explore-page-header">

        <div>

          <h1>
            Explore
          </h1>

          <p>
            Discover people, activities and trending posts
          </p>

        </div>

      </div>


      {/* =================================================
          SUGGESTIONS
          EXISTING SECTION - KEPT
      ================================================= */}

      <section
        className="explore-section"
        id="explore-suggestions"
      >

        <div className="explore-section-header">

          <div>

            <div className="section-title-row">

              <span className="section-icon people-icon">
                <PeopleOutlineOutlinedIcon />
              </span>

              <h2>
                Suggestions For You
              </h2>

            </div>

            <p>
              People you may know
            </p>

          </div>


          <button
            type="button"
            className="view-all-button"
            onClick={() =>
              navigate("/suggestions")
            }
          >
            View All

            <ArrowForwardIosOutlinedIcon />

          </button>

        </div>


        {usersLoading && (

          <div className="explore-loading">
            Loading suggestions...
          </div>

        )}


        {usersError && (

          <div className="explore-error">
            Unable to load suggestions.
          </div>

        )}


        {!usersLoading &&
          !usersError &&
          suggestions.length === 0 && (

            <div className="explore-empty">
              No more suggestions available.
            </div>

          )}


        {!usersLoading &&
          !usersError &&
          suggestions.length > 0 && (

            <div className="explore-user-list">

              {suggestions
                .slice(0, 5)
                .map((person) => (

                  <div
                    className="explore-user"
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
                        "User"
                      }
                      onClick={() =>
                        navigate(
                          `/profile/${person.id}`
                        )
                      }
                    />


                    <div
                      className="explore-user-info"
                      onClick={() =>
                        navigate(
                          `/profile/${person.id}`
                        )
                      }
                    >

                      <strong>
                        {person.name ||
                          person.username ||
                          "User"}
                      </strong>

                      <span>
                        {person.city ||
                          `@${person.username}`}
                      </span>

                    </div>


                    <button
                      type="button"
                      className={
                        person.following
                          ? "explore-following"
                          : "explore-follow"
                      }
                      disabled={
                        followMutation.isPending
                      }
                      onClick={() =>
                        followMutation.mutate({
                          userId: person.id,
                          following:
                            Boolean(
                              person.following
                            ),
                        })
                      }
                    >

                      {person.following
                        ? "Following"
                        : (
                          <>
                            <PersonAddOutlinedIcon />
                            Follow
                          </>
                        )}

                    </button>

                  </div>

                ))}

            </div>

          )}

      </section>


      {/* =================================================
          LATEST ACTIVITIES
          EXISTING SECTION - KEPT
      ================================================= */}

      <section className="explore-section">

        <div className="explore-section-header">

          <div>

            <div className="section-title-row">

              <span className="section-icon activity-icon">
                <NotificationsNoneOutlinedIcon />
              </span>

              <h2>
                Latest Activities
              </h2>

            </div>

            <p>
              Recent updates from SocialSphere
            </p>

          </div>


          <button
            type="button"
            className="view-all-button"
            onClick={() =>
              navigate("/activities")
            }
          >
            View All

            <ArrowForwardIosOutlinedIcon />

          </button>

        </div>


        {activitiesLoading && (

          <div className="explore-loading">
            Loading activities...
          </div>

        )}


        {activitiesError && (

          <div className="explore-error">
            Unable to load activities.
          </div>

        )}


        {!activitiesLoading &&
          !activitiesError &&
          activities.length === 0 && (

            <div className="explore-empty">
              No recent activities.
            </div>

          )}


        {!activitiesLoading &&
          !activitiesError &&
          activities.length > 0 && (

            <div className="explore-activity-list">

              {activities
                .slice(0, 7)
                .map((activity) => (

                  <div
                    className="explore-activity"
                    key={`${activity.activityType}-${activity.activityId}`}
                  >

                    <div className="explore-activity-avatar">

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

                      <span>
                        {getActivityIcon(
                          activity.activityType
                        )}
                      </span>

                    </div>


                    <div className="explore-activity-info">

                      <strong>
                        {activity.activityText}
                      </strong>

                      <small>
                        {getRelativeTime(
                          activity.activityTime
                        )}
                      </small>

                    </div>

                  </div>

                ))}

            </div>

          )}

      </section>


      {/* =================================================
          TRENDING POSTS
          NEW SECTION
      ================================================= */}

      <section className="explore-section trending-explore-section">

        <div className="explore-section-header">

          <div>

            <div className="section-title-row">

              <span className="section-icon trending-icon">

                <TrendingUpOutlinedIcon />

              </span>

              <h2>
                Trending Posts
              </h2>

            </div>

            <p>
              Popular posts right now
            </p>

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {trendingLoading && (

          <div className="explore-loading">
            Loading trending posts...
          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {trendingError && (

          <div className="explore-error">
            Unable to load trending posts.
          </div>

        )}


        {/* =================================================
            EMPTY
        ================================================= */}

        {!trendingLoading &&
          !trendingError &&
          trendingPosts.length === 0 && (

            <div className="explore-empty">

              <TrendingUpOutlinedIcon />

              <span>
                No trending posts yet.
              </span>

            </div>

          )}


        {/* =================================================
            TRENDING POSTS LIST
        ================================================= */}

        {!trendingLoading &&
          !trendingError &&
          trendingPosts.length > 0 && (

            <div className="explore-trending-list">

              {trendingPosts
                .slice(0, 5)
                .map((post, index) => (

                  <article
                    className="explore-trending-card"
                    key={post.id}
                    onClick={() =>
                      navigate(
                        `/profile/${post.userId}`
                      )
                    }
                  >

                    {/* RANK */}

                    <div className="explore-trending-rank">
                      #{index + 1}
                    </div>


                    {/* AUTHOR */}

                    <div className="explore-trending-author">

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


                    {/* IMAGE */}

                    {post.img && (

                      <img
                        className="explore-trending-image"
                        src={getImageUrl(post.img)}
                        alt="Trending post"
                      />

                    )}


                    {/* VIDEO */}

                    {!post.img &&
                      post.video && (

                        <video
                          className="explore-trending-image"
                          src={getImageUrl(post.video)}
                          muted
                          playsInline
                        />

                      )}


                    {/* DESCRIPTION */}

                    <p className="explore-trending-description">

                      {post.desc
                        ? post.desc.length > 120
                          ? `${post.desc.substring(
                              0,
                              120
                            )}...`
                          : post.desc
                        : "Shared a new post"}

                    </p>


                    {/* STATS */}

                    <div className="explore-trending-stats">

                      <span>

                        <FavoriteBorderOutlinedIcon />

                        {Number(
                          post.likesCount || 0
                        )}

                        Likes

                      </span>


                      <span>

                        <CommentOutlinedIcon />

                        {Number(
                          post.commentsCount || 0
                        )}

                        Comments

                      </span>


                      <span className="trending-time">

                        {getRelativeTime(
                          post.createdAt
                        )}

                      </span>

                    </div>

                  </article>

                ))}

            </div>

          )}

      </section>


    </div>

  );

};


export default Explore;