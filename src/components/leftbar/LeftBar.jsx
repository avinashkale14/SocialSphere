import "./leftbar.scss";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";

import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";

import makeRequest from "../../axios";
import getImageUrl from "../../utils/imageUrl";

const LeftBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { toggle, darkMode } = useContext(DarkModeContext);

  const navigate = useNavigate();

  const profileImage =
    getImageUrl(currentUser?.profilePic) ||
    "https://i.pravatar.cc/150?img=12";

  /* =========================
     SCROLL HELPER
  ========================= */

  const scrollToElement = (id) => {
    setTimeout(() => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 350);
  };

  /* =========================
     CREATE POST
  ========================= */

  const handleCreatePost = () => {
    navigate("/");
    scrollToElement("create-post");
  };

  /* =========================
     STORIES
  ========================= */

  const handleStories = () => {
    navigate("/");
    scrollToElement("stories-section");
  };

  /* =========================
     MY POSTS
  ========================= */

  const handleMyPosts = () => {
    if (!currentUser?.id) {
      return;
    }

    navigate(`/profile/${currentUser.id}`);

    scrollToElement("my-posts-section");
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = async () => {
    try {
      await makeRequest.post("/auth/logout");
    } catch (error) {
      console.log(
        "LOGOUT ERROR:",
        error.response?.data || error.message
      );
    } finally {
      logout();

      navigate("/login", {
        replace: true,
      });
    }
  };

  return (
    <aside className="leftBar">

      {/* =========================
          PROFILE
      ========================= */}

      <Link
        to={`/profile/${currentUser?.id}`}
        className="sidebarProfile"
      >
        <div className="sidebarProfileImage">
          <img
            src={profileImage}
            alt={currentUser?.name || "User"}
          />

          <span className="profileStatusDot" />
        </div>

        <div className="sidebarProfileInfo">
          <strong>
            {currentUser?.name || "User"}
          </strong>

          <span>
            @{currentUser?.username || "user"}
          </span>

          <small>
            View your profile
          </small>
        </div>

        <KeyboardArrowRightOutlinedIcon className="profileArrow" />
      </Link>


      {/* =========================
          MAIN
      ========================= */}

      <div className="sidebarSection">

        <div className="sectionTitle">
          MAIN
        </div>

        <div className="sidebarMenu">

          {/* HOME */}

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `sidebarItem mainItem ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="itemIcon homeIcon">
              <HomeOutlinedIcon />
            </span>

            <span className="itemText">
              Home
            </span>
          </NavLink>


          {/* =========================
              DARK MODE
          ========================= */}

          <button
            type="button"
            className="sidebarItem sidebarButton themeToggleItem"
            onClick={toggle}
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            <span className="itemIcon themeToggleIcon">
              {darkMode ? (
                <WbSunnyOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </span>

            <span className="itemText">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>


          {/* NOTIFICATIONS */}

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `sidebarItem mainItem ${
                isActive ? "active" : ""
              }`
            }
          >
            <span className="itemIcon notificationIcon">
              <NotificationsNoneOutlinedIcon />
            </span>

            <span className="itemText">
              Notifications
            </span>
          </NavLink>

        </div>
      </div>


      <div className="sidebarDivider" />


      {/* =========================
          QUICK ACCESS
      ========================= */}

      <div className="sidebarSection">

        <div className="sectionTitle">
          QUICK ACCESS
        </div>

        <div className="quickAccessMenu">

          {/* CREATE POST */}

          <button
            type="button"
            className="quickAccessItem"
            onClick={handleCreatePost}
          >
            <span className="itemIcon createIcon">
              <AddPhotoAlternateOutlinedIcon />
            </span>

            <span className="quickAccessContent">
              <strong>
                Create Post
              </strong>

              <small>
                Share something new
              </small>
            </span>

            <ArrowForwardIosOutlinedIcon className="quickAccessArrow" />
          </button>


          {/* STORIES */}

          <button
            type="button"
            className="quickAccessItem"
            onClick={handleStories}
          >
            <span className="itemIcon storyIcon">
              <AutoStoriesOutlinedIcon />
            </span>

            <span className="quickAccessContent">
              <strong>
                Stories
              </strong>

              <small>
                View latest stories
              </small>
            </span>

            <ArrowForwardIosOutlinedIcon className="quickAccessArrow" />
          </button>


          {/* MY POSTS */}

          <button
            type="button"
            className="quickAccessItem"
            onClick={handleMyPosts}
          >
            <span className="itemIcon postIcon">
              <ArticleOutlinedIcon />
            </span>

            <span className="quickAccessContent">
              <strong>
                My Posts
              </strong>

              <small>
                View your posts
              </small>
            </span>

            <ArrowForwardIosOutlinedIcon className="quickAccessArrow" />
          </button>

        </div>
      </div>


      <div className="sidebarDivider" />


      {/* =========================
          ACCOUNT
      ========================= */}

      <div className="sidebarSection">

        <div className="sectionTitle">
          ACCOUNT
        </div>

        <div className="sidebarMenu">

          <button
            type="button"
            className="sidebarItem sidebarButton logoutItem"
            onClick={handleLogout}
          >
            <span className="itemIcon">
              <LogoutOutlinedIcon />
            </span>

            <span className="itemText">
              Logout
            </span>
          </button>

        </div>
      </div>


      {/* =========================
          SOCIALSPHERE
      ========================= */}

      <div className="socialSphereCard">

        <div className="socialSphereIcon">
          <HubOutlinedIcon />
        </div>

        <div className="socialSphereInfo">

          <strong>
            SocialSphere
          </strong>

          <span>
            Connect • Share • Discover
          </span>

        </div>

      </div>

    </aside>
  );
};

export default LeftBar;