import "./navbar.scss";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";

import getImageUrl from "../../utils/imageUrl";
import makeRequest from "../../axios";

import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const Navbar = () => {
  const { toggle, darkMode } =
    useContext(DarkModeContext);

  const { currentUser, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();

  // ======================================================
  // STATES
  // ======================================================

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [searchUsers, setSearchUsers] =
    useState([]);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [recentSearches, setRecentSearches] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "socialsphere_recent_searches"
        );

        const parsed = saved
          ? JSON.parse(saved)
          : [];

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch (error) {
        return [];
      }
    });

  const [desktopSearchFocused, setDesktopSearchFocused] =
    useState(false);

  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const searchRef = useRef(null);
  const mobileInputRef = useRef(null);

  // ======================================================
  // PROFILE IMAGE
  // ======================================================

  const profileImage =
    getImageUrl(currentUser?.profilePic) ||
    "https://i.pravatar.cc/150?img=12";

  // ======================================================
  // CLOSE MOBILE MENU ON OUTSIDE CLICK
  // ======================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !(
          hamburgerRef.current &&
          hamburgerRef.current.contains(event.target)
        )
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ======================================================
  // SEARCH USERS
  // ======================================================

  useEffect(() => {
    const searchPeople = async () => {
      const query =
        searchText.trim().toLowerCase();

      if (!query) {
        setSearchUsers([]);
        return;
      }

      try {
        setSearchLoading(true);

        const res =
          await makeRequest.get("/users");

        const users = Array.isArray(
          res.data
        )
          ? res.data
          : [];

        const filtered = users.filter(
          (user) => {
            const name =
              user.name?.toLowerCase() || "";

            const username =
              user.username?.toLowerCase() ||
              "";

            return (
              name.includes(query) ||
              username.includes(query)
            );
          }
        );

        const rankedUsers = filtered
          .filter(
            (user) =>
              Number(user.id) !==
              Number(currentUser?.id)
          )
          .sort((a, b) => {
            const aName =
              a.name?.toLowerCase() || "";
            const aUsername =
              a.username?.toLowerCase() || "";
            const bName =
              b.name?.toLowerCase() || "";
            const bUsername =
              b.username?.toLowerCase() || "";

            const aStarts =
              aName.startsWith(query) ||
              aUsername.startsWith(query);
            const bStarts =
              bName.startsWith(query) ||
              bUsername.startsWith(query);

            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;
            return 0;
          })
          .slice(0, 6);

        setSearchUsers(rankedUsers);
      } catch (error) {
        console.log(
          "NAVBAR SEARCH ERROR:",
          error.response?.data ||
            error.message
        );

        setSearchUsers([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timer = setTimeout(
      searchPeople,
      250
    );

    return () =>
      clearTimeout(timer);
  }, [
    searchText,
    currentUser?.id,
  ]);

  // ======================================================
  // RECENT SEARCHES
  // ======================================================

  const saveRecentSearch = (user) => {
    if (!user?.id) {
      return;
    }

    const item = {
      id: user.id,
      name:
        user.name ||
        user.username ||
        "User",
      username: user.username || "",
      profilePic: user.profilePic || "",
    };

    setRecentSearches((previous) => {
      const filtered = previous.filter(
        (savedUser) =>
          Number(savedUser.id) !==
          Number(user.id)
      );

      const updated = [
        item,
        ...filtered,
      ].slice(0, 5);

      localStorage.setItem(
        "socialsphere_recent_searches",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const removeRecentSearch = (userId) => {
    setRecentSearches((previous) => {
      const updated = previous.filter(
        (user) =>
          Number(user.id) !==
          Number(userId)
      );

      localStorage.setItem(
        "socialsphere_recent_searches",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);

    localStorage.removeItem(
      "socialsphere_recent_searches"
    );
  };

  // ======================================================
  // SEARCH USER
  // ======================================================

  const handleSearchUser = (user) => {
    if (!user?.id) {
      return;
    }

    saveRecentSearch(user);

    navigate(`/profile/${user.id}`);

    setSearchText("");
    setSearchUsers([]);
    setSearchOpen(false);
    setMenuOpen(false);
    setDesktopSearchFocused(false);
  };

  const handleRecentSearch = (user) => {
    handleSearchUser(user);
  };

  // ======================================================
  // OPEN SEARCH
  // ======================================================

  const handleSearchClick = () => {
    // Search and Quick Menu must never stay open together.
    setMenuOpen(false);
    setSearchOpen(true);

    setTimeout(() => {
      if (mobileInputRef.current) {
        mobileInputRef.current.focus();
      }
    }, 100);
  };

  // ======================================================
  // CLOSE SEARCH
  // ======================================================

  const closeSearch = () => {
    setSearchText("");
    setSearchUsers([]);
    setSearchOpen(false);
    setMenuOpen(false);
  };

  // ======================================================
  // MOBILE HAMBURGER MENU
  // ======================================================

  const handleMobileMenuClick = () => {
    setSearchOpen(false);
    setSearchText("");
    setSearchUsers([]);
    setMenuOpen((previous) => !previous);
  };

  // ======================================================
  // EXPLORE / GRID
  // ======================================================

  const handleGridClick = () => {
    setSearchOpen(false);

    // Explore stays a separate navbar action on mobile.
    // It must NOT control the hamburger menu.
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
      navigate("/explore");
      return;
    }

    // Desktop behaviour remains unchanged.
    setMenuOpen((previous) => !previous);
  };

  // ======================================================
  // SCROLL TO ELEMENT AFTER NAVIGATION
  // ======================================================

  const goToHomeAndScroll = (
    elementId
  ) => {
    setMenuOpen(false);

    if (
      window.location.pathname !== "/"
    ) {
      navigate("/");
    }

    setTimeout(() => {
      const element =
        document.getElementById(
          elementId
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 350);
  };

  // ======================================================
  // LOGOUT
  // ======================================================

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
      navigate("/login", { replace: true });
    }
  };

  // ======================================================
  // MOBILE MENU ACTIONS
  // ======================================================

  const handleMenuAction = (type) => {
    setMenuOpen(false);

    // ----------------------------------------------
    // CREATE POST
    // ----------------------------------------------

    if (type === "createPost") {
      goToHomeAndScroll("create-post");
      return;
    }

    // ----------------------------------------------
    // MY POSTS
    // ----------------------------------------------

    if (type === "myPosts") {
      if (currentUser?.id) {
        navigate(
          `/profile/${currentUser.id}`
        );
      }

      return;
    }

    // ----------------------------------------------
    // STORIES
    // ----------------------------------------------

    if (type === "stories") {
      goToHomeAndScroll(
        "stories-section"
      );

      return;
    }

    // ----------------------------------------------
    // DISCOVER PEOPLE
    // ----------------------------------------------

    if (type === "discover") {
      /*
        RightBar is hidden on mobile,
        so we cannot scroll to .suggestionsCard.

        Instead, open the navbar search.
      */

      setSearchOpen(true);
      setSearchText("");

      setTimeout(() => {
        if (mobileInputRef.current) {
          mobileInputRef.current.focus();
        }
      }, 100);

      return;
    }

    // ----------------------------------------------
    // NOTIFICATIONS
    // ----------------------------------------------

    if (type === "notifications") {
      // Notifications will be connected
      // in the Notifications module.
      return;
    }
  };

  // ======================================================
  // DATA
  // ======================================================

  return (
    <nav className="navbar">

      {/* ==================================================
          MOBILE HAMBURGER
      ================================================== */}

      <button
        type="button"
        className={`mobile-menu-button ${
          menuOpen ? "active" : ""
        }`}
        ref={hamburgerRef}
        onClick={handleMobileMenuClick}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? (
          <CloseOutlinedIcon />
        ) : (
          <MenuOutlinedIcon />
        )}
      </button>


      {/* ==================================================
          LEFT
      ================================================== */}

      <div className="left">

        {/* LOGO */}

        <Link
          to="/"
          className="logo"
        >
          SocialSphere
        </Link>


        {/* NAV ICONS */}

        <div className="nav-icons">

          {/* HOME */}

          <Link
            to="/"
            className="nav-icon home-icon"
            aria-label="Home"
          >
            <HomeOutlinedIcon />
          </Link>


          {/* THEME */}

          <button
            type="button"
            className="nav-icon theme-icon"
            onClick={toggle}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <WbSunnyOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </button>


          {/* GRID */}

          <button
            type="button"
            className="nav-icon grid-icon"
            onClick={handleGridClick}
            aria-label="Explore"
          >
            <GridViewOutlinedIcon />
          </button>

        </div>


        {/* ==================================================
            DESKTOP SEARCH
        ================================================== */}

        <div
          className="search desktop-search"
        >

          <SearchOutlinedIcon />

          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
            onFocus={() =>
              setDesktopSearchFocused(true)
            }
            onBlur={() =>
              setTimeout(
                () =>
                  setDesktopSearchFocused(false),
                150
              )
            }
          />

          {(desktopSearchFocused ||
            searchText.trim()) && (
            <div className="searchResults">

              {searchText.trim() ? (
                <>
                  {searchLoading && (
                    <div className="searchMessage">
                      Searching...
                    </div>
                  )}

                  {!searchLoading &&
                    searchUsers.length === 0 && (
                      <div className="searchEmptyState">
                        <PersonSearchOutlinedIcon />

                        <strong>
                          No users found
                        </strong>

                        <span>
                          Try a different name or username
                        </span>
                      </div>
                    )}

                  {!searchLoading &&
                    searchUsers.length > 0 &&
                    searchUsers.map((user) => (
                      <button
                        type="button"
                        className="searchUser"
                        key={user.id}
                        onClick={() =>
                          handleSearchUser(user)
                        }
                      >
                        <img
                          src={
                            getImageUrl(
                              user.profilePic
                            ) ||
                            "https://i.pravatar.cc/150?img=12"
                          }
                          alt={
                            user.name ||
                            "User"
                          }
                        />

                        <span>
                          <strong>
                            {user.name ||
                              user.username ||
                              "User"}
                          </strong>

                          {user.username && (
                            <small>
                              @{user.username}
                            </small>
                          )}
                        </span>
                      </button>
                    ))}
                </>
              ) : recentSearches.length > 0 ? (
                <>
                  <div className="recentSearchHeader">
                    <div>
                      <strong>
                        Recent searches
                      </strong>

                      <span>
                        People you viewed recently
                      </span>
                    </div>

                    <button
                      type="button"
                      className="clearRecentButton"
                      onMouseDown={(event) =>
                        event.preventDefault()
                      }
                      onClick={clearRecentSearches}
                    >
                      Clear
                    </button>
                  </div>

                  {recentSearches.map((user) => (
                    <div
                      className="recentSearchItem"
                      key={user.id}
                    >
                      <button
                        type="button"
                        className="recentSearchUser"
                        onMouseDown={(event) =>
                          event.preventDefault()
                        }
                        onClick={() =>
                          handleRecentSearch(user)
                        }
                      >
                        <HistoryOutlinedIcon />

                        <img
                          src={
                            getImageUrl(
                              user.profilePic
                            ) ||
                            "https://i.pravatar.cc/150?img=12"
                          }
                          alt={
                            user.name ||
                            "User"
                          }
                        />

                        <span>
                          <strong>
                            {user.name ||
                              "User"}
                          </strong>

                          {user.username && (
                            <small>
                              @{user.username}
                            </small>
                          )}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="removeRecentButton"
                        onMouseDown={(event) =>
                          event.preventDefault()
                        }
                        onClick={() =>
                          removeRecentSearch(user.id)
                        }
                        aria-label={`Remove ${
                          user.name || "user"
                        } from recent searches`}
                      >
                        <CloseOutlinedIcon />
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="searchEmptyState">
                  <PersonSearchOutlinedIcon />

                  <strong>
                    Search people
                  </strong>

                  <span>
                    Find people by name or username
                  </span>
                </div>
              )}

            </div>
          )}

        </div>

      </div>


      {/* ==================================================
          RIGHT
      ================================================== */}

      <div className="right">

        <button
          type="button"
          className="right-icon person-icon"
          aria-label="People"
        >
          <PersonOutlinedIcon />
        </button>


        <button
          type="button"
          className="right-icon message-icon"
          aria-label="Messages"
        >
          <EmailOutlinedIcon />
        </button>


        <button
          type="button"
          className="right-icon notification-icon"
          aria-label="Notifications"
        >
          <NotificationsOutlinedIcon />
        </button>


        {/* PROFILE */}

        <Link
          to={`/profile/${currentUser?.id}`}
          className="user"
        >

          <img
            src={profileImage}
            alt={
              currentUser?.name ||
              "User"
            }
          />

          <span>
            {currentUser?.name ||
              "User"}
          </span>

        </Link>

      </div>


      {/* ==================================================
          MOBILE SEARCH BUTTON
      ================================================== */}

      <button
        type="button"
        className={`mobile-search-button ${
          searchOpen ? "active" : ""
        }`}
        onClick={
          searchOpen
            ? closeSearch
            : handleSearchClick
        }
        aria-label={
          searchOpen
            ? "Close search"
            : "Search"
        }
      >
        {searchOpen ? (
          <CloseOutlinedIcon />
        ) : (
          <SearchOutlinedIcon />
        )}
      </button>


      {/* ==================================================
          MOBILE SEARCH
          IMPORTANT:
          This stays INSIDE navbar.
      ================================================== */}

      {searchOpen && (
        <div
          className="mobileSearchPanel"
          ref={searchRef}
        >

          <div className="mobileSearchBox">

            <SearchOutlinedIcon />

            <input
              ref={mobileInputRef}
              className="mobile-search-input"
              type="text"
              placeholder="Search people..."
              value={searchText}
              onChange={(event) =>
                setSearchText(
                  event.target.value
                )
              }
            />

            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              title="Close search"
            >
              <CloseOutlinedIcon />
            </button>

          </div>


          {/* SEARCH RESULTS / RECENT SEARCHES */}

          {searchOpen && (
            <div className="mobileSearchResults">

              {searchText.trim() ? (
                <>
                  {searchLoading && (
                    <div className="searchMessage">
                      Searching...
                    </div>
                  )}

                  {!searchLoading &&
                    searchUsers.length === 0 && (
                      <div className="searchEmptyState">
                        <PersonSearchOutlinedIcon />

                        <strong>
                          No users found
                        </strong>

                        <span>
                          Try a different name or username
                        </span>
                      </div>
                    )}

                  {!searchLoading &&
                    searchUsers.length > 0 &&
                    searchUsers.map((user) => (
                      <button
                        type="button"
                        className="searchUser"
                        key={user.id}
                        onClick={() =>
                          handleSearchUser(user)
                        }
                      >
                        <img
                          src={
                            getImageUrl(
                              user.profilePic
                            ) ||
                            "https://i.pravatar.cc/150?img=12"
                          }
                          alt={
                            user.name ||
                            "User"
                          }
                        />

                        <span>
                          <strong>
                            {user.name ||
                              user.username ||
                              "User"}
                          </strong>

                          {user.username && (
                            <small>
                              @{user.username}
                            </small>
                          )}
                        </span>
                      </button>
                    ))}
                </>
              ) : recentSearches.length > 0 ? (
                <>
                  <div className="recentSearchHeader">
                    <div>
                      <strong>
                        Recent searches
                      </strong>

                      <span>
                        People you viewed recently
                      </span>
                    </div>

                    <button
                      type="button"
                      className="clearRecentButton"
                      onClick={clearRecentSearches}
                    >
                      Clear
                    </button>
                  </div>

                  {recentSearches.map((user) => (
                    <div
                      className="recentSearchItem"
                      key={user.id}
                    >
                      <button
                        type="button"
                        className="recentSearchUser"
                        onClick={() =>
                          handleRecentSearch(user)
                        }
                      >
                        <HistoryOutlinedIcon />

                        <img
                          src={
                            getImageUrl(
                              user.profilePic
                            ) ||
                            "https://i.pravatar.cc/150?img=12"
                          }
                          alt={
                            user.name ||
                            "User"
                          }
                        />

                        <span>
                          <strong>
                            {user.name ||
                              "User"}
                          </strong>

                          {user.username && (
                            <small>
                              @{user.username}
                            </small>
                          )}
                        </span>
                      </button>

                      <button
                        type="button"
                        className="removeRecentButton"
                        onClick={() =>
                          removeRecentSearch(user.id)
                        }
                        aria-label={`Remove ${
                          user.name || "user"
                        } from recent searches`}
                      >
                        <CloseOutlinedIcon />
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="searchEmptyState">
                  <PersonSearchOutlinedIcon />

                  <strong>
                    Search people
                  </strong>

                  <span>
                    Find people by name or username
                  </span>
                </div>
              )}

            </div>
          )}

        </div>
      )}


      {/* ==================================================
          MOBILE LEFT MENU
          This menu is only visible on mobile.
          Desktop layout/menu is intentionally untouched.
      ================================================== */}

      {menuOpen && (
        <div
          className="mobileMenu"
          ref={menuRef}
        >

          {/* PROFILE */}
          <Link
            to={`/profile/${currentUser?.id}`}
            className="mobileProfileCard"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src={profileImage}
              alt={currentUser?.name || "Profile"}
            />

            <span className="mobileProfileInfo">
              <strong>
                {currentUser?.name || "User"}
              </strong>

              {currentUser?.username && (
                <small>
                  @{currentUser.username}
                </small>
              )}

              <em>
                View your profile
              </em>
            </span>

            <span className="mobileProfileArrow">
              ›
            </span>
          </Link>


          {/* MAIN */}
          <div className="mobileMenuSectionTitle">
            MAIN
          </div>

          <button
            type="button"
            className="mobileMenuItem mobileThemeItem"
            onClick={() => {
              toggle();
            }}
          >
            <span className="mobileMenuIcon themeMenuIcon">
              {darkMode ? (
                <WbSunnyOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </span>

            <span className="mobileMenuText">
              <strong>
                {darkMode
                  ? "Light Mode"
                  : "Dark Mode"}
              </strong>

              <small>
                {darkMode
                  ? "Switch to light theme"
                  : "Switch to dark theme"}
              </small>
            </span>
          </button>


          {/* QUICK ACCESS */}
          <div className="mobileMenuSectionTitle withDivider">
            QUICK ACCESS
          </div>

          <button
            type="button"
            className="mobileMenuItem"
            onClick={() =>
              handleMenuAction("createPost")
            }
          >
            <span className="mobileMenuIcon createMenuIcon">
              <EditOutlinedIcon />
            </span>

            <span className="mobileMenuText">
              <strong>Create Post</strong>
              <small>Share something new</small>
            </span>

            <span className="mobileMenuArrow">
              ›
            </span>
          </button>


          <button
            type="button"
            className="mobileMenuItem"
            onClick={() =>
              handleMenuAction("stories")
            }
          >
            <span className="mobileMenuIcon storyMenuIcon">
              <PhotoCameraOutlinedIcon />
            </span>

            <span className="mobileMenuText">
              <strong>Stories</strong>
              <small>View latest stories</small>
            </span>

            <span className="mobileMenuArrow">
              ›
            </span>
          </button>


          <button
            type="button"
            className="mobileMenuItem"
            onClick={() =>
              handleMenuAction("myPosts")
            }
          >
            <span className="mobileMenuIcon postsMenuIcon">
              <ArticleOutlinedIcon />
            </span>

            <span className="mobileMenuText">
              <strong>My Posts</strong>
              <small>View your posts</small>
            </span>

            <span className="mobileMenuArrow">
              ›
            </span>
          </button>


          {/* ACCOUNT */}
          <div className="mobileMenuSectionTitle withDivider">
            ACCOUNT
          </div>

          <button
            type="button"
            className="mobileMenuItem logoutMenuItem"
            onClick={handleLogout}
          >
            <span className="mobileMenuIcon logoutMenuIcon">
              <LogoutOutlinedIcon />
            </span>

            <span className="mobileMenuText">
              <strong>Logout</strong>
            </span>
          </button>


          {/* SOCIALSPHERE CARD */}
          <div className="mobileSocialCard">
            <span className="mobileSocialLogo">
              ✣
            </span>

            <span className="mobileSocialText">
              <strong>SocialSphere</strong>
              <small>Connect • Share • Discover</small>
            </span>
          </div>

        </div>
      )}

    </nav>
  );
};

export default Navbar;