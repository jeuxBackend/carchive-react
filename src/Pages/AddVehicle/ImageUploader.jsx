import { useId, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import add from "./assets/add.png";
import addLight from "./assets/addLight.png";
import { X, Crop, Check } from "lucide-react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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

// Crop image utility
const getCroppedImg = (image, crop, fileName) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => {
      const croppedFile = new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now()
      });
      resolve(croppedFile);
    }, 'image/jpeg', 0.95);
  });
};

const ImageUploader = ({ value = [], setValue }) => {
  const { theme } = useTheme();
  const inputId = useId();
  const [imageView, setImageView] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState([]);
  
  // Cropper states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState(null);
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [originalFiles, setOriginalFiles] = useState([]);
  const [cropResolve, setCropResolve] = useState(null);
  const imgRef = useRef(null);

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
      // Process files one by one and open cropper for each
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        
        // Open cropper modal for this image
        setCurrentCropImage(imageUrl);
        setCurrentCropIndex(value.length + i);
        setCropModalOpen(true);
        setCrop({
          unit: '%',
          width: 50,
          height: 50,
          x: 25,
          y: 25
        });
        
        // Store the original file temporarily for cropping
        setOriginalFiles(prev => [...(prev || []), file]);
        
        // Wait for user to complete cropping before processing next image
        await new Promise(resolve => {
          setCropResolve(() => resolve);
        });
      }
    }
    
    // Clear the input value to allow selecting the same file again
    event.target.value = '';
  };

  const removeImage = (index) => {
    const updatedImages = value.filter((_, i) => i !== index);
    const updatedPreviews = imageView.filter((_, i) => i !== index);
    const updatedCompressionInfo = compressionInfo.filter((_, i) => i !== index);
    setValue(updatedImages);
    setImageView(updatedPreviews);
    setCompressionInfo(updatedCompressionInfo);
  };

  const openCropModal = (index) => {
    setCurrentCropImage(imageView[index]);
    setCurrentCropIndex(index);
    setCropModalOpen(true);
    setCrop({
      unit: '%',
      width: 50,
      height: 50,
      x: 25,
      y: 25
    });
  };

  const closeCropModal = () => {
    setCropModalOpen(false);
    setCurrentCropImage(null);
    setCurrentCropIndex(null);
    setCompletedCrop(null);
    
    // Resolve the promise to continue processing next image
    if (cropResolve) {
      cropResolve();
      setCropResolve(null);
    }
  };

  const applyCrop = async () => {
    if (completedCrop && imgRef.current && currentCropIndex !== null) {
      setIsCompressing(true);
      
      try {
        const originalFile = originalFiles[currentCropIndex] || 
                           originalFiles[originalFiles.length - 1]; // Fallback to last file
        
        const croppedFile = await getCroppedImg(
          imgRef.current,
          completedCrop,
          originalFile.name
        );
        
        // Compress the cropped image
        const compressedCroppedFile = await compressImage(croppedFile, 1920, 1080, 0.6);
        
        // Calculate compression info
        const compressionRatio = ((originalFile.size - compressedCroppedFile.size) / originalFile.size * 100).toFixed(1);
        const compressionData = {
          original: originalFile,
          compressed: compressedCroppedFile,
          originalSize: originalFile.size,
          compressedSize: compressedCroppedFile.size,
          compressionRatio: compressionRatio,
          fileName: originalFile.name
        };
        
        // Add to the arrays
        const newImages = [...value, compressedCroppedFile];
        const imagePreviews = [...imageView, URL.createObjectURL(compressedCroppedFile)];
        const newCompressionInfo = [...compressionInfo, compressionData];
        
        setValue(newImages);
        setImageView(imagePreviews);
        setCompressionInfo(newCompressionInfo);
        
        closeCropModal();
      } catch (error) {
        console.error('Error cropping image:', error);
        closeCropModal();
      } finally {
        setIsCompressing(false);
      }
    }
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
                  <div className="absolute top-1 right-1 flex gap-1">
                    <button
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white p-1 rounded-full cursor-pointer hover:bg-red-600 transition-colors"
                      title="Remove Image"
                    >
                      <X size={14} />
                    </button>
                  </div>
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

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-auto rounded-lg ${
            theme === "dark" ? "bg-[#1b1c1e]" : "bg-white"
          }`}>
            <div className={`p-4 border-b ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>
                  Crop Image
                </h3>
                <button
                  onClick={closeCropModal}
                  className={`p-2 rounded-full hover:bg-opacity-80 ${
                    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X size={20} className={theme === "dark" ? "text-white" : "text-gray-900"} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={undefined}
                  className="max-w-full"
                >
                  <img
                    ref={imgRef}
                    src={currentCropImage}
                    alt="Crop preview"
                    className="max-w-full h-auto"
                    onLoad={() => {
                      // Reset crop when image loads
                      setCrop({
                        unit: '%',
                        width: 50,
                        height: 50,
                        x: 25,
                        y: 25
                      });
                    }}
                  />
                </ReactCrop>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeCropModal}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    theme === "dark" 
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Skip Crop
                </button>
                <button
                  onClick={applyCrop}
                  disabled={!completedCrop}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    completedCrop
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Check size={16} />
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;