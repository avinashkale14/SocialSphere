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

  const { currentUser } =
    useContext(AuthContext);

  const queryClient =
    useQueryClient();


  // =====================================================
  // FILE REFERENCES
  // =====================================================

  const imageRef =
    useRef(null);

  const videoRef =
    useRef(null);


  // =====================================================
  // STATES
  // =====================================================

  const [desc, setDesc] =
    useState("");

  const [image, setImage] =
    useState(null);

  const [video, setVideo] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState(null);

  const [videoPreview, setVideoPreview] =
    useState(null);

  const [location, setLocation] =
    useState("");

  const [locationOpen, setLocationOpen] =
    useState(false);

  const [feeling, setFeeling] =
    useState("");

  const [feelingOpen, setFeelingOpen] =
    useState(false);


  // =====================================================
  // CLEAN PREVIEW URLS ON UNMOUNT
  // =====================================================

  useEffect(() => {

    return () => {

      if (imagePreview) {
        URL.revokeObjectURL(
          imagePreview
        );
      }

      if (videoPreview) {
        URL.revokeObjectURL(
          videoPreview
        );
      }

    };

  }, []);


  // =====================================================
  // UPLOAD FILE
  // =====================================================

  const upload = async (file) => {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const res =
      await makeRequest.post(
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


  // =====================================================
  // CREATE POST
  // =====================================================

  const mutation =
    useMutation({

      mutationFn: async (
        newPost
      ) => {

        return makeRequest.post(
          "/posts",
          newPost
        );

      },

      onSuccess: () => {

        // Clear text
        setDesc("");

        // Clear files
        setImage(null);
        setVideo(null);

        // Clear previews
        setImagePreview(null);
        setVideoPreview(null);

        // Clear location
        setLocation("");

        // Clear feeling
        setFeeling("");

        // Close boxes
        setLocationOpen(false);
        setFeelingOpen(false);

        // Reset file inputs
        if (imageRef.current) {
          imageRef.current.value = "";
        }

        if (videoRef.current) {
          videoRef.current.value = "";
        }

        // Refresh posts
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });

      },

      onError: (err) => {

        console.log(
          "CREATE POST ERROR:",
          err.response?.data ||
            err.message
        );

        alert(
          typeof err.response?.data ===
            "string"
            ? err.response.data
            : "Something went wrong while creating post."
        );

      },

    });


  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;


    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select a valid image."
      );

      e.target.value = "";

      return;
    }


    // Remove video
    setVideo(null);
    setVideoPreview(null);

    if (videoRef.current) {
      videoRef.current.value = "";
    }


    // Revoke previous image preview
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }


    setImage(file);

    const previewURL =
      URL.createObjectURL(file);

    setImagePreview(
      previewURL
    );

    setLocationOpen(false);
    setFeelingOpen(false);

  };


  // =====================================================
  // VIDEO SELECT
  // =====================================================

  const handleVideoChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) return;


    if (
      !file.type.startsWith(
        "video/"
      )
    ) {

      alert(
        "Please select a valid video."
      );

      e.target.value = "";

      return;
    }


    // Remove image
    setImage(null);
    setImagePreview(null);

    if (imageRef.current) {
      imageRef.current.value = "";
    }


    // Revoke previous video preview
    if (videoPreview) {
      URL.revokeObjectURL(
        videoPreview
      );
    }


    setVideo(file);

    const previewURL =
      URL.createObjectURL(file);

    setVideoPreview(
      previewURL
    );

    setLocationOpen(false);
    setFeelingOpen(false);

  };


  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = () => {

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImage(null);
    setImagePreview(null);

    if (imageRef.current) {
      imageRef.current.value = "";
    }

  };


  // =====================================================
  // REMOVE VIDEO
  // =====================================================

  const removeVideo = () => {

    if (videoPreview) {
      URL.revokeObjectURL(
        videoPreview
      );
    }

    setVideo(null);
    setVideoPreview(null);

    if (videoRef.current) {
      videoRef.current.value = "";
    }

  };


  // =====================================================
  // SHARE POST
  // =====================================================

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

      alert(
        "Please add something to your post."
      );

      return;
    }


    try {

      let imgUrl = "";
      let videoUrl = "";


      // =================================================
      // IMAGE UPLOAD
      // =================================================

      if (image) {

        imgUrl =
          await upload(image);

      }


      // =================================================
      // VIDEO UPLOAD
      // =================================================

      if (video) {

        videoUrl =
          await upload(video);

      }


      // =================================================
      // CREATE POST
      // =================================================

      mutation.mutate({

        desc:
          desc.trim(),

        img:
          imgUrl,

        video:
          videoUrl,

        location:
          location.trim() ||
          null,

        feeling:
          feeling ||
          null,

      });

    } catch (err) {

      console.log(
        "UPLOAD ERROR:",
        err.response?.data ||
          err.message
      );

      alert(
        "File upload failed. Please try again."
      );

    }

  };


  // =====================================================
  // FEELINGS
  // =====================================================

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


  // =====================================================
  // SELECT FEELING
  // =====================================================

  const selectFeeling = (item) => {

    setFeeling(
      `${item.emoji} ${item.text}`
    );

    setFeelingOpen(false);
    setLocationOpen(false);

  };


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const profilePic =
    getImageUrl(
      currentUser?.profilePic
    ) ||
    getAvatarPlaceholder(currentUser?.name);


  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="share">

      <div className="container">


        {/* =================================================
            TOP
        ================================================= */}

        <div className="top">

          <div className="left">

            <img
              src={profilePic}
              alt="Profile"
            />

            <textarea
              placeholder={`What's on your mind, ${
                currentUser?.name ||
                "User"
              }?`}
              value={desc}
              onChange={(e) =>
                setDesc(
                  e.target.value
                )
              }
              maxLength={1000}
            />

          </div>


          {/* =================================================
              SMALL PREVIEW
          ================================================= */}

          {(imagePreview ||
            videoPreview) && (

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


        {/* =================================================
            LOCATION BOX
        ================================================= */}

        {locationOpen && (

          <div className="locationBox">

            <LocationOnIcon />

            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              autoFocus
              maxLength={255}
            />

            <button
              type="button"
              onClick={() =>
                setLocationOpen(
                  false
                )
              }
            >
              ✓
            </button>

          </div>

        )}


        {/* =================================================
            FEELING BOX
        ================================================= */}

        {feelingOpen && (

          <div className="feelingBox">

            {feelings.map(
              (item) => (

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

                  {item.emoji}{" "}
                  {item.text}

                </button>

              )
            )}

          </div>

        )}


        <hr />


        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="bottom">

          <div className="left">


            {/* ADD IMAGE */}

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
                onChange={
                  handleImageChange
                }
              />

            </div>


            {/* ADD VIDEO */}

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
                onChange={
                  handleVideoChange
                }
              />

            </div>


            {/* LOCATION */}

            <div
              className={`item locationItem ${
                location
                  ? "active"
                  : ""
              }`}
              onClick={() => {

                setLocationOpen(
                  (prev) => !prev
                );

                setFeelingOpen(false);

              }}
            >

              <LocationOnIcon />

              <span>
                {location
                  ? location
                  : "Add Location"}
              </span>

            </div>


            {/* FEELING */}

            <div
              className={`item feelingItem ${
                feeling
                  ? "active"
                  : ""
              }`}
              onClick={() => {

                setFeelingOpen(
                  (prev) => !prev
                );

                setLocationOpen(false);

              }}
            >

              <EmojiEmotionsIcon />

              <span>
                {feeling ||
                  "Feeling"}
              </span>

            </div>

          </div>


          {/* =================================================
              SHARE BUTTON
          ================================================= */}

          <button
            type="button"
            className="shareButton"
            onClick={handleShare}
            disabled={
              mutation.isPending
            }
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