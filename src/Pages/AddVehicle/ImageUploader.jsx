import { useId, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import add from "./assets/add.png";
import addLight from "./assets/addLight.png";
import { X } from "lucide-react";

// Image compression utility
const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          // Create a new File object with the original name
          const compressedFile = new File([blob], file.name, {
            type: blob.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const ImageUploader = ({ value = [], setValue }) => {
  const { theme } = useTheme();
  const inputId = useId();
  const [imageView, setImageView] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState([]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleImageChange = async (event) => {
    const files = Array.from(event.target.files).slice(0, 3 - value.length);
    
    if (files.length > 0) {
      setIsCompressing(true);
      
      try {
        // Compress all images and track compression info
        const compressionResults = await Promise.all(
          files.map(async (file) => {
            const compressedFile = await compressImage(file, 1920, 1080, 0.6);
            const compressionRatio = ((file.size - compressedFile.size) / file.size * 100).toFixed(1);
            
            return {
              original: file,
              compressed: compressedFile,
              originalSize: file.size,
              compressedSize: compressedFile.size,
              compressionRatio: compressionRatio,
              fileName: file.name
            };
          })
        );
        
        const compressedFiles = compressionResults.map(result => result.compressed);
        const newImages = [...value, ...compressedFiles].slice(0, 3);
        const imagePreviews = [...imageView, ...compressedFiles.map((file) => URL.createObjectURL(file))].slice(0, 3);
        const newCompressionInfo = [...compressionInfo, ...compressionResults].slice(0, 3);
        
        setValue(newImages);
        setImageView(imagePreviews);
        setCompressionInfo(newCompressionInfo);
      } catch (error) {
        console.error('Error compressing images:', error);
        // Fallback to original files if compression fails
        const newImages = [...value, ...files].slice(0, 3);
        const imagePreviews = [...imageView, ...files.map((file) => URL.createObjectURL(file))].slice(0, 3);
        
        setValue(newImages);
        setImageView(imagePreviews);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const removeImage = (index) => {
    const updatedImages = value.filter((_, i) => i !== index);
    const updatedPreviews = imageView.filter((_, i) => i !== index);
    const updatedCompressionInfo = compressionInfo.filter((_, i) => i !== index);
    setValue(updatedImages);
    setImageView(updatedPreviews);
    setCompressionInfo(updatedCompressionInfo);
  };

  return (
    <div className="flex flex-col items-center py-4 w-full">
      {isCompressing && (
        <div className="mb-4 text-sm text-blue-600 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Compressing images...
        </div>
      )}
      
      <div className="grid sm:grid-cols-3 gap-2 w-full">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="relative w-full flex-shrink-0">
            {imageView[index] ? (
              <div className="space-y-2">
                <div className="relative">
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
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                
              </div>
            ) : (
              <motion.div
                className={`w-full h-40 flex items-center justify-center rounded-lg cursor-pointer border border-dashed transition-colors ${
                  isCompressing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:opacity-80'
                } ${
                  theme === "dark" ? "bg-[#1b1c1e]" : "bg-[#f7f7f7]"
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                onClick={() => !isCompressing && document.getElementById(inputId).click()}
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
        disabled={isCompressing}
      />
    </div>
  );
};

export default ImageUploader;