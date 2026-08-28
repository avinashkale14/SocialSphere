import "./profile.scss";

import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Posts from "../../components/posts/Posts";

const Profile = () => {
  return (
    <div className="profile">

      {/* COVER + PROFILE IMAGE */}
      <div className="images">
        <img
          src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1000&auto=format&fit=crop&q=80"
          alt="Cover"
          className="cover"
        />

        <img
          src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&auto=format&fit=crop&q=80"
          alt="Avinash Kale"
          className="profilePic"
        />
      </div>


      <div className="profileContainer">

        {/* PROFILE INFORMATION */}
        <div className="uInfo">

          {/* SOCIAL LINKS */}
          <div className="left">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FacebookTwoToneIcon fontSize="large" />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <InstagramIcon fontSize="large" />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <TwitterIcon fontSize="large" />
            </a>

            <a
              href="https://www.linkedin.com/in/avinashkale14/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedInIcon fontSize="large" />
            </a>
          </div>


          {/* USER DETAILS */}
          <div className="center">

            <span className="username">
              Avinash Kale
            </span>

            <div className="info">

              <div className="item">
                <PlaceIcon />
                <span>USA</span>
              </div>

              <div className="item">
                <LanguageIcon />
                <span>Adii.dev</span>
              </div>

            </div>

            <button type="button">
              Follow
            </button>

          </div>


          {/* ACTION ICONS */}
          <div className="right">
            <EmailOutlinedIcon className="actionIcon" />
            <MoreVertIcon className="actionIcon" />
          </div>

        </div>


        {/* USER POSTS */}
        <Posts />

      </div>
    </div>
  );
};

export default Profile;