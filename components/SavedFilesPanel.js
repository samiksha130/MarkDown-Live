import React, { useState, useEffect, useMemo } from "react";
import "../styles/SavedFilesPanel.css";


const SavedFilesPanel = ({ loadFile, onClose }) => {
  const [savedFiles, setSavedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  
useEffect(() => {
    const fetchAllFiles = () => {
      const files = JSON.parse(localStorage.getItem("savedFiles")) || [];
      //Get all keys from localStorage (jo bhi file ab tak bani hai)
    const allKeys = Object.keys(localStorage).filter(key => key !== "savedFiles");

    //Remove duplicates & update state
    const allFiles = Array.from(new Set([...files, ...allKeys]));
      setSavedFiles(allFiles);
      console.log("Saved files updated:", allFiles);  // Debugging
    };
  
    fetchAllFiles();
  
    //Storage Event Listener: Update side panel jab local storage change ho
    const handleStorageChange = () => fetchAllFiles();
    window.addEventListener("storage", handleStorageChange);
    return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }, []);

//Delete File from Panel (LocalStorage se remove karega)
const handleDeleteFile = (fileName) => {
  const updatedFiles = savedFiles.filter(file => file !== fileName);
  localStorage.setItem("savedFiles", JSON.stringify(updatedFiles));
  localStorage.removeItem(fileName); // Individual file ko bhi remove karna
  setSavedFiles(updatedFiles);
};

//Memoized filtered files
const filteredFiles = useMemo(() => {
  const results = savedFiles.filter(file =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("Filtered Files:", results);  // Debugging
  return results;
}, [savedFiles, searchTerm]);

  return (
    <div className="side-panel">
      <div className="side-panel-header">
      <h3>Saved Files</h3>
      <button className="close-btn" onClick={onClose}>✖</button>
      </div>


{/* Search Bar */}
<input
        type="text"
        placeholder="Search files..."
        className="search-input"
        value={searchTerm}
        onChange={(e) =>{ setSearchTerm(e.target.value);
          console.log("Search Term Updated:", e.target.value);  // Debugging
        }}
        onKeyDown={(e) => e.stopPropagation()} // prevents editor from hijacking keys
      />

       <ul>
        {savedFiles.length === 0 ? (
          <li>No saved files</li>
        ) : filteredFiles.length > 0 ? (
          filteredFiles.map((file, index) => (
            <li key={index} >
            <span onClick={() => loadFile(file)}>{file} </span>
            <button className="delete-btn" onClick={() => handleDeleteFile(file)}>🗑</button></li>
          ))
        ) : (
          <li>No Matching files</li>
        )}
      </ul>
    </div>
  );
};

export default SavedFilesPanel;
