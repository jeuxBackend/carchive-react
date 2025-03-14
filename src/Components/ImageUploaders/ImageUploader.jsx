import { useState } from "react";
import { motion } from "framer-motion";
import placeholder from "./placeholder.png";
import { useTheme } from "../../Contexts/ThemeContext";

const ImageUploader = ({setImageFile, setImage, image}) => {
 
  const { theme } = useTheme();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file)
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 text-white">
      <motion.div
        className="w-52 h-52 rounded-lg overflow-hidden flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          key={image || "placeholder"}
          src={image || placeholder}
          alt="Uploaded"
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id="imageUpload"
      />

      <motion.label
        htmlFor="imageUpload"
        className={`cursor-pointer font-medium px-4 py-2 rounded-xl transition w-full text-center ${
          theme === "dark"
            ? "bg-[#479cff] text-white"
            : "bg-[#f7f7f7] text-black border border-[#8ac2fe]"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Upload
      </motion.label>
    </div>
  );
};

export default ImageUploader;
