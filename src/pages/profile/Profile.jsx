import "./profile.scss";

import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import Posts from "../../components/posts/Posts";
import getImageUrl from "../../utils/imageUrl";

import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import makeRequest from "../../axios";
import { AuthContext } from "../../context/authContext";

const Profile = () => {
  const {
    currentUser,
    updateUser: updateCurrentUser,
  } = useContext(AuthContext);

  const location = useLocation();
  const queryClient = useQueryClient();

  const userId = location.pathname.split("/")[2];

  // ========================================
  // STATES
  // ========================================

  const [openEdit, setOpenEdit] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");

  // SOCIAL LINKS
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // IMAGE STATES
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // ========================================
  // GET USER
  // ========================================

  const {
    isLoading,
    error,
    data,
  } = useQuery({
    queryKey: ["user", userId],

    queryFn: () =>
      makeRequest
        .get("/users/find/" + userId)
        .then((res) => res.data),

    enabled: !!userId,
  });

  // ========================================
  // RELATIONSHIP
  // ========================================

  const {
    data: relationshipData = [],
  } = useQuery({
    queryKey: ["relationship", userId],

    queryFn: () =>
      makeRequest
        .get("/relationships?userId=" + userId)
        .then((res) => res.data),

    enabled: !!userId,
  });

  // ========================================
  // FOLLOW CHECK
  // ========================================

  const isFollowing = relationshipData.some(
    (relationship) =>
      Number(
        relationship.followerUserId ??
          relationship.followerId
      ) === Number(currentUser?.id)
  );

  // ========================================
  // FOLLOW / UNFOLLOW
  // ========================================

  const followMutation = useMutation({
    mutationFn: (following) => {
      if (following) {
        return makeRequest.delete(
          "/relationships?userId=" + userId
        );
      }

      return makeRequest.post(
        "/relationships",
        {
          userId: userId,
        }
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["relationship", userId],
      });

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
    },

    onError: (err) => {
      console.log(
        "FOLLOW / UNFOLLOW ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data ||
          "Unable to follow/unfollow user!"
      );
    },
  });

  // ========================================
  // HANDLE FOLLOW
  // ========================================

  const handleFollow = () => {
    if (!currentUser) {
      alert("Please login first!");
      return;
    }

    if (
      Number(currentUser.id) ===
      Number(userId)
    ) {
      return;
    }

    if (followMutation.isPending) {
      return;
    }

    followMutation.mutate(isFollowing);
  };

  // ================= PROFILE MORE MENU =================

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";

  document.body.appendChild(textArea);
  textArea.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }

  return copied;
};

const handleCopyProfileLink = async () => {
  const profileLink = `${window.location.origin}/profile/${userId}`;

  try {
    const copied = await copyText(profileLink);

    if (!copied) {
      alert("Unable to copy profile link.");
      return;
    }

    alert("Profile link copied!");
    setMenuOpen(false);
  } catch (error) {
    console.log("COPY PROFILE LINK ERROR:", error);
    alert("Unable to copy profile link.");
  }
};

const handleShareProfile = async () => {
  const profileLink = `${window.location.origin}/profile/${userId}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: data?.name || "SocialSphere Profile",
        text: `Check out ${data?.name || "this profile"} on SocialSphere`,
        url: profileLink,
      });
    } else {
      const copied = await copyText(profileLink);

      if (!copied) {
        alert("Unable to copy profile link.");
        return;
      }

      alert("Profile link copied!");
    }

    setMenuOpen(false);
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.log("SHARE PROFILE ERROR:", error);
      alert("Unable to share profile.");
    }
  }
};

const handleUnfollowFromMenu = () => {
  if (!isFollowing || followMutation.isPending) {
    return;
  }

  followMutation.mutate(true);
  setMenuOpen(false);
};

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".profileActionsMenu")) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [userId]);

  // ========================================
  // SET FORM DATA
  // ========================================

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setCity(data.city || "");
      setWebsite(data.website || "");

      // SOCIAL LINKS
      setFacebook(data.facebook || "");
      setInstagram(data.instagram || "");
      setTwitter(data.twitter || "");
      setLinkedin(data.linkedin || "");

      // IMAGES
      setProfilePreview(
        getImageUrl(data.profilePic)
      );

      setCoverPreview(
        getImageUrl(data.coverPic)
      );
    }
  }, [data]);

  // ========================================
  // OPEN EDIT PROFILE
  // ========================================

  const openEditProfile = () => {
    setName(data?.name || "");
    setCity(data?.city || "");
    setWebsite(data?.website || "");

    // SOCIAL LINKS
    setFacebook(data?.facebook || "");
    setInstagram(data?.instagram || "");
    setTwitter(data?.twitter || "");
    setLinkedin(data?.linkedin || "");

    // RESET FILES
    setProfileFile(null);
    setCoverFile(null);

    // RESET PREVIEWS
    setProfilePreview(
      getImageUrl(data?.profilePic)
    );

    setCoverPreview(
      getImageUrl(data?.coverPic)
    );

    setOpenEdit(true);
  };

  // ========================================
  // CLOSE EDIT PROFILE
  // ========================================

  const closeEditProfile = () => {
    setOpenEdit(false);

    setProfileFile(null);
    setCoverFile(null);

    // RESET SOCIAL LINKS
    setFacebook(data?.facebook || "");
    setInstagram(data?.instagram || "");
    setTwitter(data?.twitter || "");
    setLinkedin(data?.linkedin || "");

    // RESET IMAGES
    setProfilePreview(
      getImageUrl(data?.profilePic)
    );

    setCoverPreview(
      getImageUrl(data?.coverPic)
    );
  };

  // ========================================
  // PROFILE IMAGE
  // ========================================

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setProfileFile(file);

    setProfilePreview(
      URL.createObjectURL(file)
    );
  };

  // ========================================
  // COVER IMAGE
  // ========================================

  const handleCoverImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setCoverFile(file);

    setCoverPreview(
      URL.createObjectURL(file)
    );
  };

  // ========================================
  // UPLOAD IMAGE
  // ========================================

  const upload = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const res = await makeRequest.post(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return res.data;
  };

  // ========================================
  // UPDATE PROFILE
  // ========================================

  const updateMutation = useMutation({
    mutationFn: async () => {
      let profilePic =
        data?.profilePic || null;

      let coverPic =
        data?.coverPic || null;

      // --------------------------------
      // UPLOAD NEW PROFILE PICTURE
      // --------------------------------

      if (profileFile) {
        profilePic =
          await upload(profileFile);
      }

      // --------------------------------
      // UPLOAD NEW COVER PICTURE
      // --------------------------------

      if (coverFile) {
        coverPic =
          await upload(coverFile);
      }

      // --------------------------------
      // UPDATE USER
      // --------------------------------

      const res = await makeRequest.put(
        "/users/" + userId,
        {
          name: name.trim(),
          city: city.trim(),
          website: website.trim(),

          // SOCIAL LINKS
          facebook: facebook.trim(),
          instagram: instagram.trim(),
          twitter: twitter.trim(),
          linkedin: linkedin.trim(),

          // IMAGES
          profilePic,
          coverPic,
        }
      );

      return res.data;
    },

    // ========================================
    // SUCCESS
    // ========================================

    onSuccess: async () => {
      try {
        // --------------------------------
        // GET FRESH USER DATA
        // --------------------------------

        const freshUser =
          await queryClient.fetchQuery({
            queryKey: ["user", userId],

            queryFn: () =>
              makeRequest
                .get(
                  "/users/find/" + userId
                )
                .then(
                  (res) => res.data
                ),
          });

        // --------------------------------
        // UPDATE LOGGED-IN USER
        // --------------------------------

        if (
          currentUser &&
          Number(currentUser.id) ===
            Number(userId)
        ) {
          updateCurrentUser({
            ...currentUser,
            ...freshUser,
          });
        }

        // --------------------------------
        // REFRESH PROFILE
        // --------------------------------

        await queryClient.invalidateQueries({
          queryKey: ["user", userId],
        });

        // --------------------------------
        // REFRESH POSTS
        // --------------------------------

        await queryClient.invalidateQueries({
          queryKey: ["posts"],
        });

        // --------------------------------
        // RESET FILES
        // --------------------------------

        setProfileFile(null);
        setCoverFile(null);

        // --------------------------------
        // RESET PREVIEWS
        // --------------------------------

        setProfilePreview(
          getImageUrl(
            freshUser.profilePic
          )
        );

        setCoverPreview(
          getImageUrl(
            freshUser.coverPic
          )
        );

        // --------------------------------
        // RESET FILE INPUTS
        // --------------------------------

        if (profileInputRef.current) {
          profileInputRef.current.value = "";
        }

        if (coverInputRef.current) {
          coverInputRef.current.value = "";
        }

        // --------------------------------
        // CLOSE MODAL
        // --------------------------------

        setOpenEdit(false);

        alert(
          "Profile updated successfully!"
        );
      } catch (err) {
        console.log(
          "REFRESH PROFILE ERROR:",
          err
        );

        alert(
          "Profile updated, but refresh failed. Please refresh the page."
        );
      }
    },

    // ========================================
    // ERROR
    // ========================================

    onError: (err) => {
      console.log(
        "UPDATE PROFILE ERROR:",
        err.response?.data ||
          err.message
      );

      alert(
        err?.response?.data ||
          "Something went wrong while updating profile!"
      );
    },
  });

  // ========================================
  // SAVE
  // ========================================

  const handleSave = () => {
    if (!name.trim()) {
      alert("Name cannot be empty!");
      return;
    }

    if (updateMutation.isPending) {
      return;
    }

    updateMutation.mutate();
  };

  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <div className="profileLoading">
        Loading profile...
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    console.log(
      "GET PROFILE ERROR:",
      error.response?.data ||
        error.message
    );

    return (
      <div className="profileError">
        Something went wrong!
      </div>
    );
  }

  // ========================================
  // USER NOT FOUND
  // ========================================

  if (!data) {
    return (
      <div className="profileError">
        User not found!
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="profile">

      {/* ========================================
          COVER + PROFILE IMAGE
      ======================================== */}

      <div className="images">

        <img
          src={
            getImageUrl(data.coverPic) ||
            "https://images.unsplash.com/photo-1500534623283-312aade485b7"
          }
          alt="cover"
          className="cover"
        />

        <img
          src={
            getImageUrl(data.profilePic) ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
          }
          alt="profile"
          className="profilePic"
        />

      </div>

      {/* ========================================
          PROFILE INFORMATION
      ======================================== */}

      <div className="profileContainer">

        {/* ======================================
            SOCIAL LINKS
        ====================================== */}

        <div className="left">

          {data.facebook && (
            <a
              href={data.facebook}
              target="_blank"
              rel="noopener noreferrer"
              title="Facebook"
            >
              <FacebookTwoToneIcon />
            </a>
          )}

          {data.instagram && (
            <a
              href={data.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Instagram"
            >
              <InstagramIcon />
            </a>
          )}

          {data.twitter && (
            <a
              href={data.twitter}
              target="_blank"
              rel="noopener noreferrer"
              title="Twitter / X"
            >
              <TwitterIcon />
            </a>
          )}

          {data.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          )}

        </div>

        {/* ======================================
            CENTER
        ====================================== */}

        <div className="center">

          <span className="name">
            {data.name}
          </span>

          <div className="info">

            {data.city && (
              <div className="item">
                <PlaceIcon />

                <span>
                  {data.city}
                </span>
              </div>
            )}

            {data.website && (
              <div className="item">
                <LanguageIcon />

                <span>
                  {data.website}
                </span>
              </div>
            )}

          </div>

          {/* ====================================
              UPDATE / FOLLOW
          ==================================== */}

          {Number(currentUser?.id) ===
          Number(userId) ? (

            <button
              className="updateBtn"
              onClick={openEditProfile}
            >
              Update
            </button>

          ) : (

            <button
              className="followBtn"
              onClick={handleFollow}
              disabled={
                followMutation.isPending
              }
            >
              {followMutation.isPending
                ? "Please wait..."
                : isFollowing
                ? "Following"
                : "Follow"}
            </button>

          )}

        </div>

        {/* ======================================
            RIGHT ACTIONS
        ====================================== */}

      <div className="right">

        <EmailOutlinedIcon
          className="actionIcon"
        />

        <div className="profileActionsMenu">

          <button
            type="button"
            className="actionIcon moreButton"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="More profile actions"
          >
            <MoreVertIcon />
          </button>

          {menuOpen && (
            <div className="profileMenu">

              {/* SHARE PROFILE */}
              <button
                type="button"
                onClick={handleShareProfile}
              >
                <LinkOutlinedIcon />
                <span>Share Profile</span>
              </button>

              {/* COPY PROFILE LINK */}
              <button
                type="button"
                onClick={handleCopyProfileLink}
              >
                <ContentCopyOutlinedIcon />
                <span>Copy Profile Link</span>
              </button>

              {/* UNFOLLOW */}
              {Number(currentUser?.id) !== Number(userId) &&
                isFollowing && (
                  <>
                    <div className="profileMenuDivider" />

                    <button
                      type="button"
                      className="dangerAction"
                      onClick={handleUnfollowFromMenu}
                      disabled={followMutation.isPending}
                    >
                      <PersonRemoveOutlinedIcon />
                      <span>
                        {followMutation.isPending
                          ? "Please wait..."
                          : "Unfollow"}
                      </span>
                    </button>
                  </>
                )}

            </div>
          )}

        </div>

      </div>

      </div>

      {/* ========================================
          POSTS
      ======================================== */}

      <Posts userId={userId} />

      {/* ========================================
          EDIT PROFILE MODAL
      ======================================== */}

      {openEdit && (

        <div className="editOverlay">

          <div className="editModal">

            {/* HEADER */}

            <div className="editHeader">

              <h2>
                Edit Profile
              </h2>

              <button
                className="closeBtn"
                onClick={closeEditProfile}
              >
                <CloseIcon />
              </button>

            </div>

            {/* ==================================
                PROFILE IMAGE
            ================================== */}

            <div className="editImageSection">

              <div className="editProfileImage">

                <img
                  src={
                    profilePreview ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                  }
                  alt="profile preview"
                />

                <button
                  type="button"
                  onClick={() =>
                    profileInputRef.current?.click()
                  }
                >
                  <CameraAltIcon />
                </button>

              </div>

              <span>
                Profile Picture
              </span>

              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={
                  handleProfileImage
                }
              />

            </div>

            {/* ==================================
                COVER IMAGE
            ================================== */}

            <div className="coverEditSection">

              <div className="coverPreview">

                {coverPreview ? (

                  <img
                    src={coverPreview}
                    alt="cover preview"
                  />

                ) : (

                  <div className="noCover">
                    No Cover Image
                  </div>

                )}

                <button
                  type="button"
                  onClick={() =>
                    coverInputRef.current?.click()
                  }
                >
                  <PhotoCameraIcon />
                  Change Cover
                </button>

              </div>

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={
                  handleCoverImage
                }
              />

            </div>

            {/* ==================================
                NAME
            ================================== */}

            <div className="formGroup">

              <label>
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
              />

            </div>

            {/* ==================================
                CITY
            ================================== */}

            <div className="formGroup">

              <label>
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
                placeholder="Enter your city"
              />

            </div>

            {/* ==================================
                WEBSITE
            ================================== */}

            <div className="formGroup">

              <label>
                Website
              </label>

              <input
                type="text"
                value={website}
                onChange={(e) =>
                  setWebsite(e.target.value)
                }
                placeholder="https://yourwebsite.com"
              />

            </div>

            {/* ==================================
                FACEBOOK
            ================================== */}

            <div className="formGroup">

              <label>
                Facebook
              </label>

              <input
                type="text"
                value={facebook}
                onChange={(e) =>
                  setFacebook(e.target.value)
                }
                placeholder="https://facebook.com/username"
              />

            </div>

            {/* ==================================
                INSTAGRAM
            ================================== */}

            <div className="formGroup">

              <label>
                Instagram
              </label>

              <input
                type="text"
                value={instagram}
                onChange={(e) =>
                  setInstagram(e.target.value)
                }
                placeholder="https://instagram.com/username"
              />

            </div>

            {/* ==================================
                TWITTER / X
            ================================== */}

            <div className="formGroup">

              <label>
                Twitter / X
              </label>

              <input
                type="text"
                value={twitter}
                onChange={(e) =>
                  setTwitter(e.target.value)
                }
                placeholder="https://x.com/username"
              />

            </div>

            {/* ==================================
                LINKEDIN
            ================================== */}

            <div className="formGroup">

              <label>
                LinkedIn
              </label>

              <input
                type="text"
                value={linkedin}
                onChange={(e) =>
                  setLinkedin(e.target.value)
                }
                placeholder="https://linkedin.com/in/username"
              />

            </div>

            {/* ==================================
                ACTION BUTTONS
            ================================== */}

            <div className="editActions">

              <button
                className="cancelBtn"
                onClick={closeEditProfile}
              >
                Cancel
              </button>

              <button
                className="saveBtn"
                onClick={handleSave}
                disabled={
                  updateMutation.isPending
                }
              >
                {updateMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Profile;