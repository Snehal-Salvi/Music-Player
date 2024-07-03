import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Player from './Components/Player/Player';
import Profile from './Components/Profile/Profile';
import Sidebar from './Components/Sidebar/Sidebar';

function App() {
  // State to store the list of songs fetched from the API
  const [songs, setSongs] = useState([]);
  // State to store the currently playing song
  const [currentSong, setCurrentSong] = useState(null);
  // State to store the search term for filtering songs
  const [searchTerm, setSearchTerm] = useState('');
  // Reference to the audio element in the Player component
  const audioRef = useRef(null);

  // useEffect hook to fetch songs from the API when the component mounts
  useEffect(() => {
    fetch('https://cms.samespace.com/items/songs')
      .then(response => response.json())
      .then(data => {
        // Set the fetched songs to the state
        setSongs(data.data);
        // Set the first song as the current song
        setCurrentSong(data.data[0]); 
      });
  }, []);

  // Function to handle playing the next song
  const handleNext = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    // Calculate the index of the next song, looping back to the start if at the end
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  // Function to handle playing the previous song
  const handlePrevious = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    // Calculate the index of the previous song, looping back to the end if at the start
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[previousIndex]);
  };

  // Filter the songs based on the search term
  const filteredSongs = songs.filter(song => 
    song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mainContainer" style={{
      // Apply a background gradient based on the accent color of the current song
      background: currentSong ? `linear-gradient(to bottom, ${currentSong.accent}, #151515)` : '#151515'
    }}>
      {/* Render the Profile component */}
      <Profile />
      
      {/* Render the Sidebar component with the filtered songs and search term */}
      <Sidebar 
        songs={filteredSongs} 
        setCurrentSong={setCurrentSong} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      
      {/* Render the Player component with the current song and control handlers */}
      <Player 
        song={currentSong} 
        audioRef={audioRef} 
        handleNext={handleNext} 
        handlePrevious={handlePrevious} 
      />
    </div>
  );
}

export default App;
