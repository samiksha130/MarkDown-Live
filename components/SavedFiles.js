import React, { useState, useEffect } from "react";



const SavedFilesDropdown = ({ loadFile }) => {
  const [savedFiles, setSavedFiles] = useState([]);

  // Function to fetch saved files from local storage
  const fetchSavedFiles = () => {
    const files = JSON.parse(localStorage.getItem("savedFiles")) || [];
    setSavedFiles(files);
  };

  useEffect(() => {
    fetchSavedFiles(); // Load files on mount

    // Storage Event Listener: Update list when storage changes
    const handleStorageChange = () => fetchSavedFiles();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div>
      <h3>Saved Files</h3>
      <ul>
        {savedFiles.length > 0 ? (
          savedFiles.map((file, index) => (
            <li key={index} onClick={() => loadFile(file)} style={{ cursor: "pointer" }}>
              {file}
            </li>
          ))
        ) : (
          <li style={{ color: "gray" }}>No saved files</li>
        )}
      </ul>
    </div>
  );
};

export default SavedFilesDropdown;
