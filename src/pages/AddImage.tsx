import React, { useState } from "react";
import { FiX, FiTrash } from "react-icons/fi";
import { uploadImages } from "../api/imageApi";
import { useSelector } from "react-redux";
import { rootState } from "../Redux/store";

interface ImageUploadModalUIProps {
  open: boolean;
  onClose: () => void;
  onUpload: (response:any) => void;
}

const ImageUploadModalUI: React.FC<ImageUploadModalUIProps> = ({ open, onClose, onUpload }) => {
  const user = useSelector((prev:rootState)=> prev.user.userData)

  const [addImageLoading,setAddImageLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imageNames, setImageNames] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  if (!open) {
    return null;
  }

 const onUploadImages = async () => {
  setError('');
  setAddImageLoading(true)

  // Validations
  if (selectedFiles.length === 0) {
    setError("Please select at least one image to upload.");
    setAddImageLoading(false)
    return;
  }

  if (selectedFiles.length > 12) {
    setError("You can only upload up to 12 images.");
    setAddImageLoading(false)
    return;
  }

  const nameRegex = /^[A-Za-z0-9 ]+$/; 
  if (imageNames.some((name) => name.trim() === "" || name.trim().length <= 3 || !nameRegex.test(name))) {
    setError("Please provide a valid name for each image (at least 4 characters, no symbols).");
    setAddImageLoading(false);
    return;
  }
  


  try {
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("images", file); 
    });

    formData.append('titles', JSON.stringify(imageNames));

    if(!user){
      return
    }

    formData.append('userId',user._id)
    const response = await uploadImages(formData);
    setAddImageLoading(false)
    onUpload(response)
    onClose();
  } catch (error) {
    setAddImageLoading(false)
    setError("Failed to upload images. Please try again.");
    console.log(error);
  }
};


  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles: File[] = [];
      const filesArray = Array.from(files).map((file) => {
        if (!file.type.startsWith("image/")) {
          setError("Only image files are allowed");
          return null;
        }
        return URL.createObjectURL(file);
      }).filter(Boolean) as string[]; 


      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          validFiles.push(file);
        }
      });

      if (selectedImages.length + validFiles.length > 12) {
        setError("You can only upload up to 12 images.");
        return;
      } else {
        setSelectedImages((prevImages) => [...prevImages, ...filesArray]);
        setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setImageNames((prevNames) => [
          ...prevNames,
          ...Array(validFiles.length).fill(""),
        ]);
      }
    }
  };

  const onRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setImageNames((prevNames) => prevNames.filter((_, i) => i !== index));
  };

  const onNameChange = (index: number, value: string) => {
    setImageNames((prevNames) =>
      prevNames.map((name, i) => (i === index ? value : name))
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-4/12 p-6 relative">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FiX />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add Images
        </h2>
        {error && (
          <p className="text-center text-[#e63232] bg-[#ffcbcb] p-3 my-2 rounded-md">
            {error}
          </p>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-gray-700 hover:file:bg-violet-100 mb-4"
        />
        <div className="grid grid-cols-4 gap-4 mb-4">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image || ""}
                alt={`Selected ${index}`}
                className="w-full h-28 object-cover rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                onClick={() => onRemoveImage(index)}
              >
                <FiTrash />
              </button>
              <input
                type="text"
                value={imageNames[index] || ""}
                onChange={(e) => onNameChange(index, e.target.value)}
                placeholder="Enter name"
                className="mt-2 w-full p-1 border text-xs text-black border-gray-300 rounded"
              />
            </div>
          ))}
        </div>
        <button
          className="w-full bg-gray-700 hover:bg-gray-700 text-white py-2 rounded-lg transition"
          onClick={onUploadImages}
          disabled={addImageLoading}
        >
          {addImageLoading ? "Uploading..." : "Upload Images"}
        </button>
      </div>
    </div>
  );
};

export default ImageUploadModalUI;
