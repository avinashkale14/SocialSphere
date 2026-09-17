import "./profile.scss";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import GitHubIcon from "@mui/icons-material/GitHub";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import Posts from "../../components/posts/Posts";
import getImageUrl, {
  getAvatarPlaceholder,
  getCoverPlaceholder,
} from "../../utils/imageUrl";

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
const normalizeExternalUrl = (url) => {
  if (!url) return "";
  const value = url.trim();
  if (!value) return "";
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  return `https://${value}`;
};

const Profile = () => {
  const {
    currentUser,
    updateUser: updateCurrentUser,
  } = useContext(AuthContext);

  const location = useLocation();
  const queryClient = useQueryClient();

  const userId = location.pathname.split("/")[2];

  const [openEdit, setOpenEdit] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [profilePreview, setProfilePreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

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

  const isFollowing = relationshipData.some(
    (relationship) =>
      Number(
        relationship.followerUserId ??
          relationship.followerId
      ) === Number(currentUser?.id)
  );

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

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setCity(data.city || "");
      setWebsite(data.website || "");
      setInstagram(data.instagram || "");
      setLinkedin(data.linkedin || "");
      setGithub(data.github || "");
      setProfilePreview(
        getImageUrl(data.profilePic)
      );

      setCoverPreview(
        getImageUrl(data.coverPic)
      );
    }
  }, [data]);

  const openEditProfile = () => {
    setName(data?.name || "");
    setCity(data?.city || "");
    setWebsite(data?.website || "");
    setInstagram(data?.instagram || "");
    setLinkedin(data?.linkedin || "");
    setGithub(data?.github || "");
    setProfileFile(null);
    setCoverFile(null);
    setProfilePreview(
      getImageUrl(data?.profilePic)
    );

    setCoverPreview(
      getImageUrl(data?.coverPic)
    );

    setOpenEdit(true);
  };

  const closeEditProfile = () => {
    setOpenEdit(false);

    setProfileFile(null);
    setCoverFile(null);
    setInstagram(data?.instagram || "");
    setLinkedin(data?.linkedin || "");
    setGithub(data?.github || "");
    setProfilePreview(
      getImageUrl(data?.profilePic)
    );

    setCoverPreview(
      getImageUrl(data?.coverPic)
    );
  };

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

  const updateMutation = useMutation({
    mutationFn: async () => {
      let profilePic =
        data?.profilePic || null;

      let coverPic =
        data?.coverPic || null;

      if (profileFile) {
        profilePic =
          await upload(profileFile);
      }

      if (coverFile) {
        coverPic =
          await upload(coverFile);
      }

      const res = await makeRequest.put(
        "/users/" + userId,
        {
          name: name.trim(),
          city: city.trim(),
          website: website.trim(),
          instagram: normalizeExternalUrl(instagram),
          linkedin: normalizeExternalUrl(linkedin),
          github: normalizeExternalUrl(github),
          profilePic,
          coverPic,
        }
      );

      return res.data;
    },

    onSuccess: async () => {
      try {

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

        await queryClient.invalidateQueries({
          queryKey: ["user", userId],
        });

        await queryClient.invalidateQueries({
          queryKey: ["posts"],
        });

        setProfileFile(null);
        setCoverFile(null);

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

        if (profileInputRef.current) {
          profileInputRef.current.value = "";
        }

        if (coverInputRef.current) {
          coverInputRef.current.value = "";
        }

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

  if (isLoading) {
    return (
      <div className="profileLoading">
        Loading profile...
      </div>
    );
  }

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

  if (!data) {
    return (
      <div className="profileError">
        User not found!
      </div>
    );
  }

  return (
    <div className="profile">
<div className="images">

        <img
          src={
            getImageUrl(data.coverPic) ||
            getCoverPlaceholder()
          }
          alt="cover"
          className="cover"
        />

        <img
          src={
            getImageUrl(data.profilePic) ||
            getAvatarPlaceholder(data?.name)
          }
          alt="profile"
          className="profilePic"
        />

      </div>
<div className="profileContainer">
<div className="center">

          <span className="name">
            {data.name}
          </span>

          {data.city && (
            <div className="locationInfo">
              <PlaceIcon />
              <span>{data.city}</span>
            </div>
          )}
{Number(currentUser?.id) === Number(userId) ? (
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
              disabled={followMutation.isPending}
            >
              {followMutation.isPending
                ? "Please wait..."
                : isFollowing
                ? "Following"
                : "Follow"}
            </button>
          )}
<div className="profileSocials">

            {data.instagram && (
              <a
                href={normalizeExternalUrl(data.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            )}

            {data.website && (
              <a
                href={normalizeExternalUrl(data.website)}
                target="_blank"
                rel="noopener noreferrer"
                title="My Website"
                aria-label="My Website"
              >
                <LanguageIcon />
              </a>
            )}

            {data.linkedin && (
              <a
                href={normalizeExternalUrl(data.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            )}

            {data.github && (
              <a
                href={normalizeExternalUrl(data.github)}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
            )}

          </div>

        </div>
<div className="profileActionsMenu">

          <button
            type="button"
            className="actionIcon moreButton"
            onClick={(event) => {
              event.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="More profile actions"
            title="More options"
          >
            <MoreVertIcon />
          </button>

          {menuOpen && (
            <div className="profileMenu">

              <button
                type="button"
                onClick={handleShareProfile}
              >
                <LinkOutlinedIcon />
                <span>Share Profile</span>
              </button>

              <button
                type="button"
                onClick={handleCopyProfileLink}
              >
                <ContentCopyOutlinedIcon />
                <span>Copy Profile Link</span>
              </button>

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
<Posts userId={userId} />
{openEdit && (

        <div className="editOverlay">

          <div className="editModal">
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
<div className="editImageSection">

              <div className="editProfileImage">

                <img
                  src={
                    profilePreview ||
                    getAvatarPlaceholder(data?.name)
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
<div className="coverEditSection">

              <div className="coverPreview">

                {coverPreview ? (

                  <img
                    src={coverPreview}
                    alt="cover preview"
                  />

                ) : (

                  <img
                    src={getCoverPlaceholder()}
                    alt="cover placeholder"
                  />

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
<div className="formGroup">

              <label>
                GitHub
              </label>

              <input
                type="text"
                value={github}
                onChange={(e) =>
                  setGithub(e.target.value)
                }
                placeholder="https://github.com/username"
              />

            </div>
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
