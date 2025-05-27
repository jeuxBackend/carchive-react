import { useId, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import add from "./assets/add.png";
import addLight from "./assets/addLight.png";
import { X } from "lucide-react";

// Image compression utility
const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.5) => {
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

const ImageUploader = ({ value = [], setValue, imageView = [], setImageView, onDelete, compressionInfo = [], setCompressionInfo }) => {
  const { theme } = useTheme();
  const inputId = useId();
  const [isCompressing, setIsCompressing] = useState(false);

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
            const compressedFile = await compressImage(file, 1920, 1080, 0.8);
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
        
        // For new files, create object URLs for preview
        const newImagePreviews = compressedFiles.map(file => URL.createObjectURL(file));
        
        // Merge existing images with new ones
        const newImages = [...value, ...compressedFiles].slice(0, 3);
        const newPreviews = [...imageView, ...newImagePreviews].slice(0, 3);
        const newCompressionInfo = [...(compressionInfo || []), ...compressionResults].slice(0, 3);
        
        setValue(newImages);
        setImageView(newPreviews);
        if (setCompressionInfo) {
          setCompressionInfo(newCompressionInfo);
        }
      } catch (error) {
        console.error('Error compressing images:', error);
        // Fallback to original files if compression fails
        const newImagePreviews = files.map(file => URL.createObjectURL(file));
        const newImages = [...value, ...files].slice(0, 3);
        const newPreviews = [...imageView, ...newImagePreviews].slice(0, 3);
        
        setValue(newImages);
        setImageView(newPreviews);
      } finally {
        setIsCompressing(false);
      }
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
    
    // Remove compression info if it exists
    if (setCompressionInfo && compressionInfo) {
      const updatedCompressionInfo = compressionInfo.filter((_, i) => i !== index);
      setCompressionInfo(updatedCompressionInfo);
    }
  };

  // Check if we should show compression info for new uploaded files
  const shouldShowCompressionInfo = (index) => {
    return compressionInfo && 
           compressionInfo[index] && 
           typeof imageView[index] === 'string' && 
           imageView[index].startsWith('blob:');
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
            {index < imageView.length ? (
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
                
                {/* Compression Info - Only for newly uploaded compressed files */}
                {shouldShowCompressionInfo(index) && (
                  <div className={`text-xs p-2 rounded border ${
                    theme === "dark" 
                      ? "bg-gray-800 border-gray-700 text-gray-300" 
                      : "bg-gray-50 border-gray-200 text-gray-600"
                  }`}>
                    <div className="font-medium mb-1 truncate" title={compressionInfo[index].fileName}>
                      {compressionInfo[index].fileName}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Before:</span>
                        <span className="font-medium">
                          {formatFileSize(compressionInfo[index].originalSize)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>After:</span>
                        <span className="font-medium text-green-600">
                          {formatFileSize(compressionInfo[index].compressedSize)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span>Saved:</span>
                        <span className="font-medium text-blue-600">
                          {compressionInfo[index].compressionRatio}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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