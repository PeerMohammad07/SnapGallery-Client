import React from 'react';
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface SortableItemProps {
  image : any,
  index : number,
}

export const SortableItem:React.FC<SortableItemProps> = ({ image, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition,
    zIndex: isDragging ? 999 : "auto",
    cursor: isDragging ? "grabbing" : "pointer",
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging
      ? "0px 8px 20px rgba(0, 0, 0, 0.3)" 
      : "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-[#361c3d] animate-fade-in"
    >
      <img
        src={image.image}
        alt={`Image ${index + 1}`}
        className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <p className="absolute bottom-4 left-4 z-30 text-white text-lg font-semibold">
        {image.title}
      </p>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      </div>
    </div>
  );
};