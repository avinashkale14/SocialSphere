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
import getImageUrl, {
  getAvatarPlaceholder,
} from "../../utils/imageUrl";

const LeftBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { toggle, darkMode } = useContext(DarkModeContext);

  const navigate = useNavigate();

  const profileImage =
    getImageUrl(currentUser?.profilePic) ||
    getAvatarPlaceholder(currentUser?.name);

  // Scroll helper
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

  // Create post
  const handleCreatePost = () => {
    navigate("/");
    scrollToElement("create-post");
  };

  // Stories
  const handleStories = () => {
    navigate("/");
    scrollToElement("stories-section");
  };

  // My posts
  const handleMyPosts = () => {
    if (!currentUser?.id) {
      return;
    }

    navigate(`/profile/${currentUser.id}`);
    scrollToElement("my-posts-section");
  };

  // Logout
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

      <div className="sidebarSection">
        <div className="sectionTitle">
          MAIN
        </div>

        <div className="sidebarMenu">
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
              {darkMode
                ? "Light Mode"
                : "Dark Mode"}
            </span>
          </button>

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

      <div className="sidebarSection">
        <div className="sectionTitle">
          QUICK ACCESS
        </div>

        <div className="quickAccessMenu">
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