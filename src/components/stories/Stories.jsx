import "./stories.scss";

import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";

import { AuthContext } from "../../context/authContext";
import makeRequest from "../../axios";
import {
  getAvatarPlaceholder,
} from "../../utils/imageUrl";

const Stories = () => {

  const { currentUser } =
    useContext(AuthContext);

  const queryClient =
    useQueryClient();

  const fileRef =
    useRef(null);

  const [previewFile, setPreviewFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [selectedStory, setSelectedStory] =
    useState(null);

  const [viewerOpen, setViewerOpen] =
    useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const getImageUrl = (image) => {

    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `http://localhost:8800/upload/${image}`;
  };

  const {
    isLoading,
    error,
    data: stories = [],
  } = useQuery({

    queryKey: ["stories"],

    queryFn: () =>
      makeRequest
        .get("/stories")
        .then((res) => res.data),

  });

  const uploadStoryMutation =
    useMutation({

      mutationFn: async (file) => {

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const uploadResponse =
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

        const fileName =
          uploadResponse.data;

        const storyResponse =
          await makeRequest.post(
            "/stories",
            {
              img: fileName,
            }
          );

        return storyResponse.data;
      },

      onSuccess: () => {

        queryClient.invalidateQueries({
          queryKey: ["stories"],
        });

        setPreviewFile(null);
        setPreviewUrl("");

        if (fileRef.current) {
          fileRef.current.value = "";
        }
      },

      onError: (error) => {

        console.log(
          "ADD STORY ERROR:",
          error.response?.data ||
            error.message
        );
      },

    });

  const deleteStoryMutation =
    useMutation({

      mutationFn: (storyId) =>
        makeRequest.delete(
          `/stories/${storyId}`
        ),

      onSuccess: () => {

        setSelectedStory(null);

        setViewerOpen(false);

        queryClient.invalidateQueries({
          queryKey: ["stories"],
        });
      },

      onError: (error) => {

        console.log(
          "DELETE STORY ERROR:",
          error.response?.data ||
            error.message
        );
      },

    });

  const addViewMutation =
    useMutation({

      mutationFn: (storyId) =>
        makeRequest.post(
          `/stories/${storyId}/view`
        ),

    });

  const {
    data: viewers = [],
    isLoading: viewersLoading,
  } = useQuery({

    queryKey: [
      "story-viewers",
      selectedStory?.id,
    ],

    queryFn: () =>
      makeRequest
        .get(
          `/stories/${selectedStory.id}/viewers`
        )
        .then((res) => res.data),

    enabled:
      !!selectedStory &&
      viewerOpen &&
      Number(selectedStory.userId) ===
        Number(currentUser?.id),

  });

  const handleFileChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      alert(
        "Please select an image file."
      );

      e.target.value = "";

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {

      alert(
        "Image size should be less than 10 MB."
      );

      e.target.value = "";

      return;
    }
    const objectUrl =
      URL.createObjectURL(file);

    setPreviewFile(file);
    setPreviewUrl(objectUrl);
  };

  const cancelStoryPreview = () => {

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewFile(null);
    setPreviewUrl("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const confirmStoryUpload = () => {

    if (!previewFile) {
      return;
    }

    uploadStoryMutation.mutate(
      previewFile
    );
  };

  const openStory = (story) => {

    setSelectedStory(story);

    setViewerOpen(false);

    if (
      Number(story.userId) !==
      Number(currentUser?.id)
    ) {

      addViewMutation.mutate(
        story.id
      );
    }
  };

  const closeStory = () => {

    setSelectedStory(null);

    setViewerOpen(false);
  };

  const handleDeleteStory = () => {

    if (!selectedStory) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this story?"
      );

    if (!confirmDelete) {
      return;
    }

    deleteStoryMutation.mutate(
      selectedStory.id
    );
  };

  const openViewers = () => {

    setViewerOpen(true);
  };

  const closeViewers = () => {

    setViewerOpen(false);
  };

  const goNext = () => {

    if (
      !selectedStory ||
      stories.length === 0
    ) {
      return;
    }

    const currentIndex =
      stories.findIndex(
        (story) =>
          Number(story.id) ===
          Number(selectedStory.id)
      );

    if (currentIndex === -1) {
      return;
    }

    const nextIndex =
      (currentIndex + 1) %
      stories.length;

    const nextStory =
      stories[nextIndex];

    setSelectedStory(nextStory);

    setViewerOpen(false);

    if (
      Number(nextStory.userId) !==
      Number(currentUser?.id)
    ) {

      addViewMutation.mutate(
        nextStory.id
      );
    }
  };

  const goPrevious = () => {

    if (
      !selectedStory ||
      stories.length === 0
    ) {
      return;
    }

    const currentIndex =
      stories.findIndex(
        (story) =>
          Number(story.id) ===
          Number(selectedStory.id)
      );

    if (currentIndex === -1) {
      return;
    }

    const previousIndex =
      (currentIndex - 1 + stories.length) %
      stories.length;

    const previousStory =
      stories[previousIndex];

    setSelectedStory(
      previousStory
    );

    setViewerOpen(false);

    if (
      Number(previousStory.userId) !==
      Number(currentUser?.id)
    ) {

      addViewMutation.mutate(
        previousStory.id
      );
    }
  };

  if (isLoading) {

    return (
      <div className="stories">

        <div className="storiesLoading">
          Loading stories...
        </div>

      </div>
    );
  }

  if (error) {

    return (
      <div className="stories">

        <div className="storiesError">
          Unable to load stories
        </div>

      </div>
    );
  }

  return (
    <>


      <div className="stories">

  
        <div
          className="story yourStory"
          onClick={() => {

            const ownStory =
              stories.find(
                (story) =>
                  Number(story.userId) ===
                  Number(currentUser?.id)
              );

            if (ownStory) {

              openStory(ownStory);

            } else {

              fileRef.current?.click();
            }
          }}
        >

          <img
            src={
              getImageUrl(
                currentUser?.profilePic
              ) ||
              getAvatarPlaceholder(
                currentUser?.name
              )
            }
            alt="Your Story"
          />

          <div className="storyOverlay" />

          <div className="yourStoryLabel">
            Your Story
          </div>

          <button
            type="button"
            className="addStoryButton"
            onClick={(e) => {

              e.stopPropagation();

              fileRef.current?.click();
            }}
          >
            <AddIcon />
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>

        {stories
          .filter(
            (story) =>
              Number(story.userId) !==
              Number(currentUser?.id)
          )
          .map((story) => (

            <div
              className="story"
              key={story.id}
              onClick={() =>
                openStory(story)
              }
            >

              <img
                src={getImageUrl(
                  story.img
                )}
                alt={story.name}
              />

              <div className="storyOverlay" />

              <div className="storyUser">

                <img
                  src={getImageUrl(
                    story.profilePic
                  ) ||
                  getAvatarPlaceholder(
                    story.name
                  )}
                  alt={story.name}
                />

                <span>
                  {story.name}
                </span>

              </div>

            </div>

          ))}

      </div>


      {previewFile &&
        previewUrl && (

        <div
          className="storyPreviewBackdrop"
          onClick={cancelStoryPreview}
        >

          <div
            className="storyPreviewModal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="storyPreviewHeader">

              <div>
                <h3>
                  Preview Story
                </h3>

                <span>
                  Check your photo before uploading
                </span>
              </div>

              <button
                type="button"
                className="storyPreviewClose"
                onClick={cancelStoryPreview}
                disabled={
                  uploadStoryMutation.isPending
                }
                aria-label="Close preview"
              >
                <CloseIcon />
              </button>

            </div>

            <div className="storyPreviewImageWrap">

              <img
                src={previewUrl}
                alt="Story preview"
                className="storyPreviewImage"
              />

            </div>

            <div className="storyPreviewInfo">

              <strong>
                {previewFile.name}
              </strong>

              <span>
                {(
                  previewFile.size /
                  (1024 * 1024)
                ).toFixed(2)} MB
              </span>

            </div>

            {uploadStoryMutation.isPending && (

              <div className="storyPreviewUploading">
                Uploading story...
              </div>

            )}

            <div className="storyPreviewActions">

              <button
                type="button"
                className="storyPreviewCancel"
                onClick={cancelStoryPreview}
                disabled={
                  uploadStoryMutation.isPending
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="storyPreviewUpload"
                onClick={confirmStoryUpload}
                disabled={
                  uploadStoryMutation.isPending
                }
              >
                {uploadStoryMutation.isPending
                  ? "Uploading..."
                  : "Upload Story"}
              </button>

            </div>

          </div>

        </div>
      )}


      {selectedStory &&
        !viewerOpen && (

          <div
            className="storyViewerBackdrop"
            onClick={closeStory}
          >

            <div
              className="storyViewer"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

        
              <div className="storyProgress">

                <div className="storyProgressActive" />

              </div>

        
              <div className="storyHeader">

                <div className="storyHeaderUser">

                  <img
                    src={getImageUrl(
                      selectedStory.profilePic
                    ) ||
                    getAvatarPlaceholder(
                      selectedStory.name
                    )}
                    alt={
                      selectedStory.name
                    }
                  />

                  <div>

                    <strong>
                      {selectedStory.name}
                    </strong>

                    <small>
                      {Number(
                        selectedStory.userId
                      ) ===
                      Number(
                        currentUser?.id
                      )
                        ? "Your Story"
                        : "Story"}
                    </small>

                  </div>

                </div>

                <div className="storyHeaderActions">

            
                  {Number(
                    selectedStory.userId
                  ) ===
                    Number(
                      currentUser?.id
                    ) && (

                    <button
                      type="button"
                      className="storyActionButton"
                      onClick={
                        openViewers
                      }
                      title="Viewers"
                    >

                      <VisibilityIcon />

                      <span>
                        Viewers
                      </span>

                    </button>

                  )}

            
                  {Number(
                    selectedStory.userId
                  ) ===
                    Number(
                      currentUser?.id
                    ) && (

                    <button
                      type="button"
                      className="storyDeleteButton"
                      onClick={
                        handleDeleteStory
                      }
                      title="Delete story"
                    >

                      <DeleteIcon />

                    </button>

                  )}

            
                  <button
                    type="button"
                    className="storyCloseButton"
                    onClick={
                      closeStory
                    }
                    title="Close"
                  >

                    <CloseIcon />

                  </button>

                </div>

              </div>

        
              <div className="storyImageContainer">

                <img
                  src={getImageUrl(
                    selectedStory.img
                  )}
                  alt="Story"
                  className="storyMainImage"
                />

              </div>

        
              {stories.length > 1 && (

                <button
                  type="button"
                  className="storyNavigation storyPrevious"
                  onClick={
                    goPrevious
                  }
                  aria-label="Previous story"
                >

                  <ChevronLeftIcon />

                </button>

              )}

        
              {stories.length > 1 && (

                <button
                  type="button"
                  className="storyNavigation storyNext"
                  onClick={
                    goNext
                  }
                  aria-label="Next story"
                >

                  <ChevronRightIcon />

                </button>

              )}

            </div>

          </div>

        )}


      {selectedStory &&
        viewerOpen && (

          <div
            className="storyViewerBackdrop"
            onClick={
              closeViewers
            }
          >

            <div
              className="viewersModal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

        
              <div className="viewersHeader">

                <div>

                  <h3>
                    Story Viewers
                  </h3>

                  <span>
                    {viewers.length}{" "}
                    {viewers.length === 1
                      ? "viewer"
                      : "viewers"}
                  </span>

                </div>

                <button
                  type="button"
                  onClick={
                    closeViewers
                  }
                  aria-label="Close viewers"
                >

                  <CloseIcon />

                </button>

              </div>

        
              <div className="viewersList">

                {viewersLoading ? (

                  <div className="viewersLoading">
                    Loading viewers...
                  </div>

                ) : viewers.length === 0 ? (

                  <div className="noViewers">

                    <VisibilityIcon />

                    <p>
                      No one has viewed
                      your story yet.
                    </p>

                  </div>

                ) : (

                  viewers.map(
                    (viewer) => (

                      <div
                        className="viewerItem"
                        key={viewer.id}
                      >

                        <img
                          src={getImageUrl(
                            viewer.profilePic
                          ) ||
                          getAvatarPlaceholder(
                            viewer.name
                          )}
                          alt={
                            viewer.name
                          }
                        />

                        <div className="viewerInfo">

                          <strong>
                            {viewer.name}
                          </strong>

                          <span>
                            @{viewer.username}
                          </span>

                        </div>

                        <small>
                          {new Date(
                            viewer.viewedAt
                          ).toLocaleTimeString(
                            [],
                            {
                              hour:
                                "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
                        </small>

                      </div>

                    )
                  )

                )}

              </div>

        
              <button
                type="button"
                className="backToStoryButton"
                onClick={() =>
                  setViewerOpen(
                    false
                  )
                }
              >
                ← Back to Story
              </button>

            </div>

          </div>

        )}

    </>
  );
};

export default Stories;
