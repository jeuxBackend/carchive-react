import { useId } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import add from "./assets/add.png";
import addLight from "./assets/addLight.png";
import { X } from "lucide-react";

const ImageUploader = ({ value = [], setValue, imageView = [], setImageView, onDelete }) => {
  const { theme } = useTheme();
  const inputId = useId();

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files).slice(0, 3 - value.length);
    if (files.length > 0) {
      // For new files, create object URLs for preview
      const newImagePreviews = files.map(file => URL.createObjectURL(file));
      
      // Merge existing images with new ones
      const newImages = [...value, ...files].slice(0, 3);
      const newPreviews = [...imageView, ...newImagePreviews].slice(0, 3);
      
      setValue(newImages);
      setImageView(newPreviews);
    }
  };

  const removeImage = (index) => {
    // Check if the image is an existing URL (not a new file)
    const isExistingImage = typeof imageView[index] === 'string' && 
                            imageView[index].startsWith('http');
    
    // If it's an existing image, call the delete function
    if (isExistingImage && onDelete) {
      onDelete(index, 'image');
    }
    
    // Remove from local state
    const updatedImages = value.filter((_, i) => i !== index);
    const updatedPreviews = imageView.filter((_, i) => i !== index);
    setValue(updatedImages);
    setImageView(updatedPreviews);
  };

  return (
    <div className="flex flex-col items-center py-4 w-full">
      <div className="grid sm:grid-cols-3 gap-2 w-full">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="relative w-full h-40 flex-shrink-0">
            {index < imageView.length ? (
              <>
                <motion.img
                  src={imageView[index]}
                  alt="Uploaded"
                  className="h-40 w-full object-cover rounded-lg border border-gray-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full cursor-pointer"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <motion.div
                className={`w-full h-40 flex items-center justify-center rounded-lg cursor-pointer border border-dashed ${
                  theme === "dark" ? "bg-[#1b1c1e]" : "bg-[#f7f7f7]"
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                onClick={() => document.getElementById(inputId).click()}
              >
                <img
                  src={theme === "dark" ? add : addLight}
                  className="w-[3rem]"
                  alt="Add"
                />
              </motion.div>
            )}
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="hidden"
        id={inputId}
      />
    </div>
  );
};

export default ImageUploader;