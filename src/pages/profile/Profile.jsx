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
      <div className="images">
        <img src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y292ZXJ8ZW58MHx8MHx8fDA%3D" 
        alt="" 
        className="cover"
        />
        <img src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y292ZXJ8ZW58MHx8MHx8fDA%3D" 
        alt="" 
        className="profilePic"
        />
      </div>
      <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://instagram.com">
                <InstagramIcon fontSize="large" />
            </a>
            <a href="http://twitter.com">
                <TwitterIcon fontSize="large" />
            </a>
            <a href="https://www.linkedin.com/in/avinashkale14/">
                <LinkedInIcon fontSize="large" />
            </a>
            </div>
            <div className="center">
              <span>Avinash Kale</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon/>
                  <span>USA</span>
                </div>
                <div className="item">
                  <LanguageIcon/>
                  <span>Adii.dev</span>
                </div>
              </div>
              <button>follow</button>
            </div>
            <div className="right">
              <EmailOutlinedIcon/>
              <MoreVertIcon/>
            </div>
          </div>
          <Posts/>
      </div>
    </div>
  );
};

export default Profile;