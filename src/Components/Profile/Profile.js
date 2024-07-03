import React from "react";
import SpotifyLogo from "../../assets/logo.png";
import ProfilePicture from "../../assets/profile.png";
import styles from "./Profile.module.css";

export default function Profile() {
  return (
    <div className={styles.profileContainer}>
      {/* Container for the application name and logo */}
      <div className={styles.appNameContainer}>
        <img src={SpotifyLogo} alt="Spotify Logo" className={styles.logo} />
        {/* Display the application name */}
        <h1 className={styles.name}>Spotify</h1>
      </div>

      {/* Container for the user's profile picture */}
      <div className={styles.profilePicContainer}>
        <img
          src={ProfilePicture}
          alt="Profile Pic"
          className={styles.profilePic}
        />
      </div>
    </div>
  );
}
