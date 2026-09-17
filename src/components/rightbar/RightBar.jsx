import "./rightbar.scss";

import {
  useContext,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import { AuthContext } from "../../context/authContext";

import makeRequest from "../../axios";

import {
  getImageUrl,
  getAvatarPlaceholder,
} from "../../utils/imageUrl";

const RightBar = () => {

  const { currentUser } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const queryClient =
    useQueryClient();

  const [
    showAllSuggestions,
    setShowAllSuggestions,
  ] = useState(false);

  const [
    showAllActivities,
    setShowAllActivities,
  ] = useState(false);

  const {
    isLoading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery({

    queryKey: [
      "rightbarUsers",
    ],

    queryFn: async () => {

      const res =
        await makeRequest.get(
          "/users"
        );

      return res.data;
    },

    enabled: !!currentUser,

  });

  const {
    isLoading: activitiesLoading,
    error: activitiesError,
    data: activitiesData,
  } = useQuery({

    queryKey: [
      "activities",
    ],

    queryFn: async () => {

      const res =
        await makeRequest.get(
          "/activities"
        );

      return res.data;
    },

    enabled: !!currentUser,

    refetchInterval: 30000,

  });

  const {
    isLoading: latestPostLoading,
    error: latestPostError,
    data: latestPostData,
  } = useQuery({

    queryKey: [
      "latestPost",
    ],

    queryFn: async () => {

      const res =
        await makeRequest.get(
          "/trending"
        );

      return res.data;
    },

    enabled: !!currentUser,

    refetchInterval: 30000,

  });

  const followMutation =
    useMutation({

      mutationFn: async (
        userId
      ) => {

        return makeRequest.post(
          "/relationships",
          {
            userId,
          }
        );
      },

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: [
            "rightbarUsers",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "activities",
          ],
        });

      },

      onError: (error) => {

        console.log(
          "FOLLOW ERROR:",
          error.response?.data ||
            error.message
        );

      },

    });

  const unfollowMutation =
    useMutation({

      mutationFn: async (
        userId
      ) => {

        return makeRequest.delete(
          `/relationships?userId=${userId}`
        );

      },

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: [
            "rightbarUsers",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "activities",
          ],
        });

      },

      onError: (error) => {

        console.log(
          "UNFOLLOW ERROR:",
          error.response?.data ||
            error.message
        );

      },

    });

  const handleFollow = (
    person
  ) => {

    if (!person?.id) {
      return;
    }

    if (person.following) {

      unfollowMutation.mutate(
        person.id
      );

    } else {

      followMutation.mutate(
        person.id
      );

    }

  };

  const getRelativeTime = (
    date
  ) => {

    if (!date) {
      return "";
    }

    const activityDate =
      new Date(date);

    const now =
      new Date();

    const diff =
      now.getTime() -
      activityDate.getTime();

    const seconds =
      Math.floor(
        diff / 1000
      );

    if (seconds < 10) {
      return "Just now";
    }

    if (seconds < 60) {
      return `${seconds}s ago`;
    }

    const minutes =
      Math.floor(
        seconds / 60
      );

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours =
      Math.floor(
        minutes / 60
      );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days =
      Math.floor(
        hours / 24
      );

    if (days < 7) {
      return `${days}d ago`;
    }

    const weeks =
      Math.floor(
        days / 7
      );

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

  const getActivityIcon = (
    type
  ) => {

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

  const suggestions =
    usersData || [];

  const activities =
    activitiesData || [];

  const latestPost =
    (latestPostData || [])[0] ||
    null;

  const avatar = (
    image,
    name
  ) => {

    return (
      getImageUrl(image) ||
      getAvatarPlaceholder(name)
    );

  };

  const visibleSuggestions =
    showAllSuggestions
      ? suggestions
      : suggestions.slice(0, 3);

  const visibleActivities =
    showAllActivities
      ? activities
      : activities.slice(0, 3);

  return (

    <aside className="rightBar">

      {}

      <section className="rightCard suggestionsCard">

        <div className="cardHeader">

          <div className="standardTitleWrapper">

            <div className="standardTitleIcon suggestionsTitleIcon">

              <PeopleOutlineOutlinedIcon />

            </div>

            <div>

              <h3>
                Suggestions For You
              </h3>

              <span className="cardSubtitle">
                People you may know
              </span>

            </div>

          </div>

          {suggestions.length > 3 && (

            <button
              type="button"
              className="seeAllButton"
              onClick={() =>
                setShowAllSuggestions(
                  !showAllSuggestions
                )
              }
            >

              {showAllSuggestions
                ? "Show Less"
                : "View All"}

            </button>

          )}

        </div>

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

        {!usersLoading &&
          !usersError &&
          visibleSuggestions.length > 0 && (

            <div className="suggestionList">

              {visibleSuggestions.map(
                (person) => (

                  <div
                    className="suggestionItem"
                    key={person.id}
                  >

                    <img
                      src={avatar(
                        person.profilePic,
                        person.name ||
                          person.username ||
                          "User"
                      )}

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
                          (
                            person.following
                              ? "Following"
                              : "Suggested for you"
                          )}

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
                        handleFollow(
                          person
                        )
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

                )
              )}

            </div>

          )}

      </section>

      {}

      <section className="rightCard">

        <div className="cardHeader">

          <div className="standardTitleWrapper">

            <div className="standardTitleIcon activitiesTitleIcon">

              <NotificationsNoneOutlinedIcon />

            </div>

            <div>

              <h3>
                Latest Activities
              </h3>

              <span className="cardSubtitle">
                Recent updates
              </span>

            </div>

          </div>

          {activities.length > 3 && (

            <button
              type="button"
              className="seeAllButton"
              onClick={() =>
                setShowAllActivities(
                  !showAllActivities
                )
              }
            >

              {showAllActivities
                ? "Show Less"
                : "View All"}

            </button>

          )}

        </div>

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

        {!activitiesLoading &&
          !activitiesError &&
          visibleActivities.length > 0 && (

            <div className="activityList">

              {visibleActivities.map(
                (activity) => (

                  <div
                    className="activityItem"
                    key={`${activity.activityType}-${activity.activityId}`}
                  >

                    <div className="activityAvatar">

                      <img
                        src={avatar(
                          activity.profilePic,
                          activity.name ||
                            "User"
                        )}

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

                )
              )}

            </div>

          )}

      </section>

      {}

      <section className="rightCard trendingCard">

        <div className="cardHeader">

          <div className="trendingTitleWrapper">

            <div className="trendingTitleIcon">

              <TrendingUpOutlinedIcon />

            </div>

            <div>

              <h3>
                Latest Post
              </h3>

              <span className="cardSubtitle">
                Newest post right now
              </span>

            </div>

          </div>

        </div>

        {latestPostLoading && (

          <div className="emptyState">

            <div className="emptyIcon">
              ⏳
            </div>

            <span>
              Loading latest post...
            </span>

          </div>

        )}

        {latestPostError && (

          <div className="emptyState">

            <div className="emptyIcon">
              ⚠️
            </div>

            <span>
              Unable to load latest post
            </span>

          </div>

        )}

        {!latestPostLoading &&
          !latestPostError &&
          !latestPost && (

            <div className="emptyState">

              <div className="emptyIcon">
                📝
              </div>

              <span>
                No latest post yet
              </span>

            </div>

          )}

        {!latestPostLoading &&
          !latestPostError &&
          latestPost && (

            <div
              className="trendingList"
              onClick={() =>
                navigate(
                  `/profile/${latestPost.userId}`
                )
              }
            >

              <div className="trendingItem">

                <div className="trendingRank">
                  1
                </div>

                <div className="trendingContent">

                  {}

                  <div className="trendingAuthor">

                    <img
                      src={avatar(
                        latestPost.profilePic,
                        latestPost.name ||
                          latestPost.username ||
                          "User"
                      )}

                      alt={
                        latestPost.name ||
                        latestPost.username ||
                        "User"
                      }
                    />

                    <div>

                      <strong>

                        {latestPost.name ||
                          latestPost.username ||
                          "User"}

                      </strong>

                      <span>

                        @{latestPost.username ||
                          "user"}

                      </span>

                    </div>

                  </div>

                  {}

                  {latestPost.img && (

                    <img
                      className="trendingPostImage"

                      src={getImageUrl(
                        latestPost.img
                      )}

                      alt="Latest post"
                    />

                  )}

                  {}

                  {!latestPost.img &&
                    latestPost.video && (

                      <video
                        className="trendingPostImage"

                        src={getImageUrl(
                          latestPost.video
                        )}

                        muted
                        playsInline
                      />

                    )}

                  {}

                  <p className="trendingDescription">

                    {latestPost.desc
                      ? latestPost.desc.length > 80
                        ? `${latestPost.desc.substring(
                            0,
                            80
                          )}...`
                        : latestPost.desc
                      : "Shared a new post"}

                  </p>

                  {}

                  <div className="trendingStats">

                    <span>

                      <FavoriteBorderOutlinedIcon />

                      {Number(
                        latestPost.likesCount ||
                          0
                      )}

                    </span>

                    <span>

                      <CommentOutlinedIcon />

                      {Number(
                        latestPost.commentsCount ||
                          0
                      )}

                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}

      </section>

    </aside>

  );

};

export default RightBar;
