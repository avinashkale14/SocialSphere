import "./navbar.scss";

import { Link } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";

import { useContext } from "react";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  return (
    <nav className="navbar">

      {/* LEFT SIDE */}
      <div className="left">

        <Link to="/" className="logo">
          <span>SocialSphere</span>
        </Link>

        <div className="nav-icons">
          <HomeOutlinedIcon className="desktop-icon" />

          {darkMode ? (
            <WbSunnyOutlinedIcon
              className="theme-icon"
              onClick={toggle}
            />
          ) : (
            <DarkModeOutlinedIcon
              className="theme-icon"
              onClick={toggle}
            />
          )}

          <GridViewOutlinedIcon className="grid-icon" />
        </div>

        <div className="search">
          <SearchOutlinedIcon />

          <input
            type="text"
            placeholder="Search..."
          />
        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="right">

        <PersonOutlinedIcon className="person-icon" />

        <EmailOutlinedIcon className="message-icon" />

        <NotificationsOutlinedIcon className="notification-icon" />

        <div className="user">
          <img
            src={currentUser.profilePic}
            alt={currentUser.name}
          />

          <span>{currentUser.name}</span>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;