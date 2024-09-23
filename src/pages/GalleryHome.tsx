import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { IoCloseCircleSharp } from "react-icons/io5";
import Navbar from './Navbar';
import { deleteImage, getAllImages, imageOrderChange } from '../api/imageApi';
import { useSelector } from 'react-redux';
import { rootState } from '../Redux/store';
import Swal from 'sweetalert2';
import EditImageModal from './EditImageModal';
import toast from 'react-hot-toast';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from './Item';

interface Image {
  _id: string;
  title: string;
  image: string;
}

const GalleryHome: React.FC = () => {
  const [images, setImages] = useState<Image[] | []>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null); // State to hold the selected image for full view
  const userData = useSelector((prev: rootState) => prev.user.userData);
  const [editImageModalOpen, setEditImageModalOpen] = useState(false);
  const [editImage, setEditImage] = useState<Image | null>(null);
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    fetchImages();
  }, [userData]);

  const fetchImages = async () => {
    if (!userData) return;
   try {
    setIsLoading(true)
    const response = await getAllImages(userData?._id);
    const sortedImages = response.data.data.sort((a: any, b: any) => a.order - b.order);
    setImages(sortedImages);
    setIsLoading(false)
   } catch (error) {
     setIsLoading(false)
    console.log(error)
   }
  };

  const onUpload = (response: any) => {
    try {
      if (response.data.status) {
        setImages((prevImages) => [...prevImages, ...response.data.data])
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {

    }
  }

  const onClose = () => {
    setEditImageModalOpen(false);
    setEditImage(null);
  };

  const handleEditImageSubmit = (imageId: string, response: any) => {
    const updatedImage = response.data.data;

    setImages((prevImages: any) =>
      prevImages.map((image: any) =>
        image._id === imageId ? { ...image, ...updatedImage } : image
      )
    );

    toast.success("Image edited successfully");
  };


  const onDelete = (id: string) => {
    try {
      if (!userData) return;
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to delete?',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await deleteImage(id, userData?._id);
          if (response.data) {
            setImages((image) => image.filter((post) => post._id !== id));
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openFullView = (image: Image) => {
    setSelectedImage(image);
  };

  const closeFullView = () => {
    setSelectedImage(null);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    const oldIndex = images.findIndex((image) => image._id == active.id)
    const newIndex = images.findIndex((image) => image._id == over.id)
    const changedImages = arrayMove(images, oldIndex, newIndex)
    setImages(changedImages)

    const updatedImages = changedImages.map((image, index) => ({
      _id: image._id,
      order: index + 1
    }))
    try {
      const response = await imageOrderChange(updatedImages)
      console.log(response)
    } catch (error) {
      console.log(error)
    }

  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleEdit = (image: any) => {
    setEditImageModalOpen(true);
    setEditImage(image);
  }
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar onUpload={onUpload} />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-8  ">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="relative w-full h-64 bg-gray-200 rounded-lg animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-gray-300 rounded-lg w-32 h-32" />
                </div>
              </div>
            ))}
          </div>
        ) : <main className="container mx-auto py-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img: any) => img._id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((image, index) => (
                  <>
                    <div key={image._id} className="relative group">
                      <SortableItem image={image} index={index} />
                      <div className='absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50'>
                        <button onClick={() => { handleEdit(image) }} className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transition duration-300">
                          <FiEdit
                          />
                        </button>
                        <button
                          onClick={() => onDelete(image._id)}
                          className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition duration-300"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          onClick={() => openFullView(image)}
                          className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition duration-300"
                        >
                          <FiEye />
                        </button>

                      </div>
                    </div>
                  </>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </main>}

        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative bg-gray-800 rounded-lg p-6 max-w-3xl w-full">
              <button
                onClick={closeFullView}
                className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition duration-300"
              >
                <IoCloseCircleSharp />
              </button>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-96 object-contain rounded-lg"
              />
              <h2 className="text-white text-center mt-4">{selectedImage.title}</h2>
            </div>
          </div>
        )}
      </div>

      {editImageModalOpen && (
        <EditImageModal
          open={editImageModalOpen}
          onClose={onClose}
          image={editImage}
          onUpload={handleEditImageSubmit}
        />
      )}
    </>
  );
};

export default GalleryHome;
