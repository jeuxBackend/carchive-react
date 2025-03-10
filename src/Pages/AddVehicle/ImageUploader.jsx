import { useState, useId } from "react";
import { motion } from "framer-motion";
import add from "./assets/add.png";
import addLight from "./assets/addLight.png";
import { useTheme } from "../../Contexts/ThemeContext";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const { theme } = useTheme();
  const inputId = useId(); 

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center  p-4">
      <motion.div
        className={`w-full h-42 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer ${
          theme === "dark" ? "bg-[#1b1c1e]" : "bg-[#f7f7f7]"
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onClick={() => document.getElementById(inputId).click()} 
      >
        {image ? (
          <motion.img
            key={image}
            src={image}
            alt="Uploaded"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <img src={theme === "dark" ? add : addLight} className="w-[3rem]" />
        )}
      </motion.div>

   
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id={inputId}
      />
    </div>
  );
};

export default ImageUploader;
