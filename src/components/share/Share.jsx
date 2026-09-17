import "./share.scss";

import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import ImageIcon from "@mui/icons-material/Image";
import VideoCameraBackIcon from "@mui/icons-material/VideoCameraBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

import { AuthContext } from "../../context/authContext";
import makeRequest from "../../axios";
import getImageUrl, {
  getAvatarPlaceholder,
} from "../../utils/imageUrl";

const Share = () => {
  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const imageRef = useRef(null);
  const videoRef = useRef(null);

  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const [location, setLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);

  const [feeling, setFeeling] = useState("");
  const [feelingOpen, setFeelingOpen] = useState(false);

  // Preview cleanup
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [imagePreview, videoPreview]);

  // Upload file
  const upload = async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const res = await makeRequest.post(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  };

  // Create post
  const mutation = useMutation({
    mutationFn: async (newPost) => {
      return makeRequest.post(
        "/posts",
        newPost
      );
    },

    onSuccess: () => {
      setDesc("");

      setImage(null);
      setVideo(null);

      setImagePreview(null);
      setVideoPreview(null);

      setLocation("");
      setFeeling("");

      setLocationOpen(false);
      setFeelingOpen(false);

      if (imageRef.current) {
        imageRef.current.value = "";
      }

      if (videoRef.current) {
        videoRef.current.value = "";
      }

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },

    onError: (err) => {
      console.log(
        "CREATE POST ERROR:",
        err.response?.data || err.message
      );

      alert(
        typeof err.response?.data === "string"
          ? err.response.data
          : "Something went wrong while creating post."
      );
    },
  });

  // Image select
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");

      e.target.value = "";

      return;
    }

    setVideo(null);
    setVideoPreview(null);

    if (videoRef.current) {
      videoRef.current.value = "";
    }

    setImage(file);

    const previewURL = URL.createObjectURL(file);

    setImagePreview(previewURL);

    setLocationOpen(false);
    setFeelingOpen(false);
  };

  // Video select
  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("Please select a valid video.");

      e.target.value = "";

      return;
    }

    setImage(null);
    setImagePreview(null);

    if (imageRef.current) {
      imageRef.current.value = "";
    }

    setVideo(file);

    const previewURL = URL.createObjectURL(file);

    setVideoPreview(previewURL);

    setLocationOpen(false);
    setFeelingOpen(false);
  };

  // Remove image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);

    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  // Remove video
  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);

    if (videoRef.current) {
      videoRef.current.value = "";
    }
  };

  // Share post
  const handleShare = async (e) => {
    e.preventDefault();

    if (mutation.isPending) {
      return;
    }

    if (
      !desc.trim() &&
      !image &&
      !video &&
      !location.trim() &&
      !feeling
    ) {
      alert("Please add something to your post.");

      return;
    }

    try {
      let imgUrl = "";
      let videoUrl = "";

      if (image) {
        imgUrl = await upload(image);
      }

      if (video) {
        videoUrl = await upload(video);
      }

      mutation.mutate({
        desc: desc.trim(),
        img: imgUrl,
        video: videoUrl,
        location: location.trim() || null,
        feeling: feeling || null,
      });
    } catch (err) {
      console.log(
        "UPLOAD ERROR:",
        err.response?.data || err.message
      );

      alert(
        "File upload failed. Please try again."
      );
    }
  };

  const feelings = [
    {
      emoji: "😊",
      text: "Happy",
    },
    {
      emoji: "❤️",
      text: "Loved",
    },
    {
      emoji: "😂",
      text: "Funny",
    },
    {
      emoji: "😎",
      text: "Cool",
    },
    {
      emoji: "😢",
      text: "Sad",
    },
    {
      emoji: "🔥",
      text: "Excited",
    },
  ];

  // Select feeling
  const selectFeeling = (item) => {
    setFeeling(
      `${item.emoji} ${item.text}`
    );

    setFeelingOpen(false);
    setLocationOpen(false);
  };

  const profilePic =
    getImageUrl(currentUser?.profilePic) ||
    getAvatarPlaceholder(currentUser?.name);

  return (
    <div className="share">
      <div className="container">

        {/* Top */}
        <div className="top">
          <div className="left">
            <img
              src={profilePic}
              alt="Profile"
            />

            <textarea
              placeholder={`What's on your mind, ${
                currentUser?.name || "User"
              }?`}
              value={desc}
              onChange={(e) =>
                setDesc(e.target.value)
              }
              maxLength={1000}
            />
          </div>

          {/* Preview */}
          {(imagePreview || videoPreview) && (
            <div className="preview">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Selected"
                />
              )}

              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  muted
                />
              )}

              <button
                type="button"
                className="remove"
                onClick={
                  imagePreview
                    ? removeImage
                    : removeVideo
                }
                aria-label="Remove selected media"
              >
                <CloseIcon />
              </button>
            </div>
          )}
        </div>

        {/* Location */}
        {locationOpen && (
          <div className="locationBox">
            <LocationOnIcon />

            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              autoFocus
              maxLength={255}
            />

            <button
              type="button"
              onClick={() =>
                setLocationOpen(false)
              }
            >
              ✓
            </button>
          </div>
        )}

        {/* Feeling */}
        {feelingOpen && (
          <div className="feelingBox">
            {feelings.map((item) => (
              <button
                type="button"
                key={item.text}
                className={
                  feeling ===
                  `${item.emoji} ${item.text}`
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  selectFeeling(item)
                }
              >
                {item.emoji} {item.text}
              </button>
            ))}
          </div>
        )}

        <hr />

        {/* Bottom */}
        <div className="bottom">
          <div className="left">

            {/* Add image */}
            <div
              className="item imageItem"
              onClick={() =>
                imageRef.current?.click()
              }
            >
              <ImageIcon />

              <span>
                Add Image
              </span>

              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </div>

            {/* Add video */}
            <div
              className="item videoItem"
              onClick={() =>
                videoRef.current?.click()
              }
            >
              <VideoCameraBackIcon />

              <span>
                Add Video
              </span>

              <input
                ref={videoRef}
                type="file"
                accept="video/*"
                hidden
                onChange={handleVideoChange}
              />
            </div>

            {/* Location */}
            <div
              className={`item locationItem ${
                location ? "active" : ""
              }`}
              onClick={() => {
                setLocationOpen((prev) => !prev);
                setFeelingOpen(false);
              }}
            >
              <LocationOnIcon />

              <span>
                {location || "Add Location"}
              </span>
            </div>

            {/* Feeling */}
            <div
              className={`item feelingItem ${
                feeling ? "active" : ""
              }`}
              onClick={() => {
                setFeelingOpen((prev) => !prev);
                setLocationOpen(false);
              }}
            >
              <EmojiEmotionsIcon />

              <span>
                {feeling || "Feeling"}
              </span>
            </div>
          </div>

          {/* Share button */}
          <button
            type="button"
            className="shareButton"
            onClick={handleShare}
            disabled={mutation.isPending}
          >
            <SendIcon />

            {mutation.isPending
              ? "Sharing..."
              : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Share;