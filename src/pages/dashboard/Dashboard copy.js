import React, { useState } from "react";
import { Button, Container, Typography, Box } from "@material-ui/core";

const FileUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`file-${i}`, selectedFiles[i]);
    }

    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data", // Set the correct Content-Type
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle response from Flask API if needed
        console.log(data);
        // Reset selectedFiles after successful upload
        setSelectedFiles([]);
      })
      .catch((error) => {
        // Handle errors if any
        console.error("Error uploading files: ", error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h5">Upload CSV Files</Typography>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileInput"
          multiple
        />
        <label htmlFor="fileInput">
          <Button variant="contained" component="span">
            Select Files
          </Button>
        </label>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0}
          style={{ marginLeft: "10px" }}
        >
          Upload
        </Button>

        {selectedFiles.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle1">
              {selectedFiles.length} file(s) selected:
            </Typography>
            <ul>
              {Array.from(selectedFiles).map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FileUploader;
