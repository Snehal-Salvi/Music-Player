import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { FaBars, FaSearch } from "react-icons/fa";

export default function Sidebar({
  songs,
  setCurrentSong,
  searchTerm,
  setSearchTerm,
}) {
  // State to track the selected category (either "For You" or "Top Tracks")
  const [category, setCategory] = useState("For You");
  
  // State to track if the sidebar is open on small screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State to track if the screen is considered small (less than 768px width)
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  // Effect to handle resizing of the window and update isSmallScreen state accordingly
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Filter songs based on the search term and selected category
  const filteredSongs = songs.filter((song) => {
    // Check if the song matches the search term
    const matchesSearchTerm =
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());

    // Check if the song matches the selected category
    const matchesCategory = category === "For You" || song.top_track === true;

    // Return true if the song matches both search term and category
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div className={styles.sidebarContainer}>
      {/* Render a menu button if the screen is small */}
      {isSmallScreen ? (
        <button
          className={styles.menuButton}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          Menu <FaBars />
        </button>
      ) : (
        // Render category buttons if the screen is not small
        <div className={styles.categoryButtons}>
          <button
            className={`${styles.categoryButton} ${
              category === "For You" ? styles.active : ""
            }`}
            onClick={() => setCategory("For You")}
          >
            For You
          </button>
          <button
            className={`${styles.categoryButton} ${
              category === "Top Tracks" ? styles.active : ""
            }`}
            onClick={() => setCategory("Top Tracks")}
          >
            Top Tracks
          </button>
        </div>
      )}

      {/* Render the songs section if the sidebar is open or the screen is not small */}
      {isSidebarOpen || !isSmallScreen ? (
        <div className={styles.songsSection}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search Song, Artist"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon}/>
          </div>

          <div className={styles.songsContainer}>
            <div className={styles.songList}>
              {/* Display a message if no songs match the search criteria */}
              {filteredSongs.length === 0 ? (
                <div className={styles.noResult}>No results found</div>
              ) : (
                // Map over the filtered songs and render each song item
                filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    className={styles.songItem}
                    onClick={() => setCurrentSong(song)}
                  >
                    <img
                      src={`https://cms.samespace.com/assets/${song.cover}`}
                      alt={song.name}
                      className={styles.songCover}
                    />
                    <div className={styles.songDetails}>
                      <p className={styles.songName}>{song.name}</p>
                      <p className={styles.songArtist}>{song.artist}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
