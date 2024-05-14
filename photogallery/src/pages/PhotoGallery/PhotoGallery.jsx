import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PhotoGallery.css";

const PhotoGallery = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Fetch images from the backend with JWT token
  const fetchImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/api/images", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setImages(response.data.images);
    } catch (error) {
      console.error(
        "Error fetching images:",
        error.response ? error.response.data.error : error.message
      );
    }
  };

  // Fetch images from the backend on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const token = localStorage.getItem("token");

    try {
      setUploading(true);
      await axios.post("http://127.0.0.1:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUploading(false);
      fetchImages();
    } catch (error) {
      console.error(
        "Error uploading image:",
        error.response ? error.response.data.error : error.message
      );
      setUploading(false);
    }
  };

  return (
    <div className="gallery-container">
      <h1>Photo Gallery</h1>
      <input type="file" onChange={handleFileUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      <div className="images-container">
        {images.map((imageData, index) => (
          <img
            key={index}
            src={`data:image/jpeg;base64,${imageData.data}`}
            alt={`Uploaded ${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
