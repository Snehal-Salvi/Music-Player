import React, { useEffect, useState } from "react";
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import styles from "./Player.module.css";  
import { BsThreeDots } from "react-icons/bs";
import { FaVolumeHigh } from "react-icons/fa6";
import { IoMdVolumeOff } from "react-icons/io";

export default function Player({ song, audioRef, handleNext, handlePrevious }) {
  // State variables
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause
  const [isVolumeOn, setIsVolumeOn] = useState(false); // State to manage volume on/off
  const [currentTime, setCurrentTime] = useState(0); // State to track current playback time
  const [duration, setDuration] = useState(null); // State to store audio duration (initialize to null)

  // Function to toggle play/pause of audio
  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      if (audioRef.current.readyState >= 2) { // 2 means 'HAVE_CURRENT_DATA'
        audioRef.current.play().then(() => setIsPlaying(true)).catch((error) => console.error(error));
      } else {
        console.log("Audio is not ready to play yet.");
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Function to toggle volume on/off
  const toggleVolume = () => {
    audioRef.current.muted = !isVolumeOn;
    setIsVolumeOn(!isVolumeOn);
  };

  // Function to update current time and duration of audio
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  // Function to handle seeking in the audio track
  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Effect to update the audio source and play the song when 'song' or 'audioRef' changes
  useEffect(() => {
    if (song && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = song.url;
      setIsPlaying(false); // Ensure audio starts paused

      const onLoadedData = () => {
        togglePlayPause(); // Play the song once it's ready
      };

      audioRef.current.addEventListener('loadeddata', onLoadedData);

      return () => {
        audioRef.current.removeEventListener('loadeddata', onLoadedData);
      };
    }
  }, [song, audioRef]);

  // If no song is selected, display a message
  if (!song)
    return <div className={styles.playerContainer}>Select a song to play</div>;

  // Render the player interface
  return (
    <div className={styles.playerContainer}>
      {/* Song details section */}
      <div className={styles.songDetails}>
        <p className={styles.songName}>{song.name}</p>
        <p className={styles.songArtist}>{song.artist}</p>
      </div>

      {/* Song cover image */}
      <div className={styles.songCover}>
        <img
          src={`https://cms.samespace.com/assets/${song.cover}`}
          alt={song.name}
        />
      </div>

      {/* Audio element for playback */}
      <audio
        ref={audioRef}
        className={styles.audioPlayer}
        onTimeUpdate={handleTimeUpdate} // Update current time and duration on time update
      />

      {/* Track slider for seeking through the audio */}
      <div className={styles.trackSlider}>
        <input
          type="range"
          min={0}
          max={duration || 0} // Use a fallback in case duration is null
          value={currentTime}
          onChange={handleSeek} // Handle seeking when slider value changes
          className={styles.slider}
        />
      </div>

      {/* Control buttons */}
      <div className={styles.controls}>
        <button>
          <BsThreeDots className={styles.options} />
        </button>
        <button onClick={handlePrevious}>
          <FaBackward className={styles.forwardBackward} />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? (
            <FaPause className={styles.playPause} />
          ) : (
            <FaPlay className={styles.playPause} />
          )}
        </button>
        <button onClick={handleNext}>
          <FaForward className={styles.forwardBackward} />
        </button>
        <button onClick={toggleVolume}>
          {isVolumeOn ? (
            <IoMdVolumeOff className={styles.options} />
          ) : (
            <FaVolumeHigh className={styles.options} />
          )}
        </button>
      </div>
    </div>
  );
}
