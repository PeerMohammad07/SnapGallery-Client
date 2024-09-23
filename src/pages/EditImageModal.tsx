import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { rootState } from "../Redux/store";
import { editImage } from "../api/imageApi";

interface ImageUploadModalUIProps {
  open: boolean;
  onClose: () => void;
  onUpload: any
  image: {
    _id: string,
    image: string
    title: string
  } | any
}

const ImageUploadModalUI: React.FC<ImageUploadModalUIProps> = ({ open, onClose, onUpload, image }) => {
  const user = useSelector((prev: rootState) => prev.user.userData);

  const [addImageLoading, setAddImageLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (image.image) {
      setSelectedImage(image.image);
    }
    if (image.title) {
      setImageName(image.title);
    }
  }, [image.image, image.title]);

  if (!open) {
    return null;
  }

  const onUploadImage = async () => {
    setError('');
    setAddImageLoading(true);

    // Validations
    if (!selectedFile && !image.image) {
      setError("Please select an image to upload.");
      setAddImageLoading(false);
      return;
    }

    if (imageName.trim() === "" || imageName.trim().length <= 3) {
      setError("Please provide a valid name for the image (at least 4 characters).");
      setAddImageLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      formData.append('title', imageName);

      if (!user) {
        return;
      }

      formData.append('imageId', image._id)
      formData.append('userId', user._id);
      const response = await editImage(formData);
      setAddImageLoading(false);
      onUpload(image._id, response);
      onClose();
    } catch (error) {
      setAddImageLoading(false);
      setError("Failed to upload image. Please try again.");
      console.log(error);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }

      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file)); // Set preview for the new image
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg w-4/12 p-6 relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FiX />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {image.image ? "Edit Image" : "Add Image"}
        </h2>
        {error && (
          <p className="text-center text-[#e63232] bg-[#ffcbcb] p-3 my-2 rounded-md">
            {error}
          </p>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-gray-700 hover:file:bg-violet-100 mb-4"
        />
        <div className="mb-4">
          <img
            src={selectedImage || image.image || ""}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg mb-2"
          />
        </div>
        <input
          type="text"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          placeholder="Enter name"
          className="w-full p-2 border text-black bg-gray-100 border-gray-300 rounded mb-4"
        />
       <div className="mt-4 w-full flex justify-center">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg w-full transition duration-300"
        onClick={onUploadImage}
        disabled={addImageLoading}
      >
        {addImageLoading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
      </div>
    </div>

  );
};

export default ImageUploadModalUI;
