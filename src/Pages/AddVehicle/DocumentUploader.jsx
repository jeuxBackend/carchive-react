import { useId, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import add from "./assets/add.png";
import addLight from "./assets/addLight.png";
import { X, Calendar, Edit3, FileText, Image, Crop, Check } from "lucide-react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useTranslation } from 'react-i18next'

const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img'); 
    
    img.onload = () => {
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
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
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
    
    img.onerror = () => {
      console.error('Error loading image for compression');
      resolve(file); 
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const getCroppedImg = (image, crop, fileName) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!crop || !image) {
      reject(new Error('Missing crop or image'));
      return;
    }

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
      if (!blob) {
        reject(new Error('Failed to create blob'));
        return;
      }
      
      const croppedFile = new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now()
      });
      resolve(croppedFile);
    }, 'image/jpeg', 0.95);
  });
};

const DocumentUploader = ({ value = [], setValue, type, setAdditionalDates, setAdditionalTitles }) => {
  const { theme } = useTheme();
  const inputId = useId();
  const [documentView, setDocumentView] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDate, setModalDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [additionalTitles, setLocalAdditionalTitles] = useState([]);
  const [additionalDates, setLocalAdditionalDates] = useState([]);
  const [isCompressing, setIsCompressing] = useState(false);
  
  // Cropper states
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState(null);
  const [currentCropIndex, setCurrentCropIndex] = useState(null);
  const [currentCropFile, setCurrentCropFile] = useState(null);
  const [crop, setCrop] = useState({
    unit: '%',
    width: 50,
    height: 50,
    x: 25,
    y: 25
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cropResolve, setCropResolve] = useState(null);
  const imgRef = useRef(null);
    const { t } = useTranslation();
  const handleDocumentChange = async (event) => {
    const files = Array.from(event.target.files);
    
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith("image/");
      const isPDF = file.type === "application/pdf";
      return isImage || isPDF;
    });

    if (validFiles.length > 0) {
      if (type === "additional") {
        const processedFiles = [];
        
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          
          if (file.type.startsWith("image/")) {
            const imageUrl = URL.createObjectURL(file);
            setCurrentCropImage(imageUrl);
            setCurrentCropFile(file);
            setCropModalOpen(true);
            setCrop({
              unit: '%',
              width: 50,
              height: 50,
              x: 25,
              y: 25
            });
            
            const croppedFile = await new Promise(resolve => {
              setCropResolve(() => resolve);
            });
            
            if (croppedFile) {
              processedFiles.push(croppedFile);
            }
          } else {
            processedFiles.push(file);
          }
        }
        
        setPendingFiles(processedFiles);
        setShowModal(true);
        setModalTitle("");
        setModalDate("");
        setEditIndex(null);
      } else {
        const processedFiles = [];
        
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          
          if (file.type.startsWith("image/")) {
            const imageUrl = URL.createObjectURL(file);
            setCurrentCropImage(imageUrl);
            setCurrentCropFile(file);
            setCropModalOpen(true);
            setCrop({
              unit: '%',
              width: 50,
              height: 50,
              x: 25,
              y: 25
            });
            
            const croppedFile = await new Promise(resolve => {
              setCropResolve(() => resolve);
            });
            
            if (croppedFile) {
              processedFiles.push(croppedFile);
            }
          } else {
            processedFiles.push(file);
          }
        }
        
        const documentPreviews = processedFiles.map((file) => 
          file.type.startsWith("image") ? URL.createObjectURL(file) : file.name
        );

        setValue([...value, ...processedFiles]);
        setDocumentView([...documentView, ...documentPreviews]);
      }
    }
    
    if (files.length > validFiles.length) {
      alert("Only images and PDF files are allowed. Some files were filtered out.");
    }
    
    event.target.value = '';
  };

  const handleModalSubmit = () => {
    const title = modalTitle.trim() || "No Title";
    const date = modalDate || "No Date";
    
    if (editIndex !== null) {
      const newTitles = [...additionalTitles];
      const newDates = [...additionalDates];
      newTitles[editIndex] = title;
      newDates[editIndex] = date;
      
      setLocalAdditionalTitles(newTitles);
      setLocalAdditionalDates(newDates);
      
      if (setAdditionalTitles) setAdditionalTitles(newTitles);
      if (setAdditionalDates) setAdditionalDates(newDates);
    } else {
      const newDocuments = pendingFiles.map((file) => file);
      const documentPreviews = pendingFiles.map((file) => 
        file.type.startsWith("image") ? URL.createObjectURL(file) : file.name
      );

      setValue([...value, ...newDocuments]);
      setDocumentView([...documentView, ...documentPreviews]);
      
      const newTitles = [...additionalTitles, ...pendingFiles.map(() => title)];
      const newDates = [...additionalDates, ...pendingFiles.map(() => date)];
      
      setLocalAdditionalTitles(newTitles);
      setLocalAdditionalDates(newDates);
      
      if (setAdditionalTitles) setAdditionalTitles(newTitles);
      if (setAdditionalDates) setAdditionalDates(newDates);
    }

    setShowModal(false);
    setPendingFiles([]);
    setModalTitle("");
    setModalDate("");
    setEditIndex(null);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setPendingFiles([]);
    setModalTitle("");
    setModalDate("");
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setModalTitle(additionalTitles[index] === "No Title" ? "" : additionalTitles[index]);
    setModalDate(additionalDates[index] === "No Date" ? "" : additionalDates[index]);
    setShowModal(true);
  };

  const removeDocument = (index) => {
    setValue(value.filter((_, i) => i !== index));
    setDocumentView(documentView.filter((_, i) => i !== index));
    
    if (type === "additional") {
      const newTitles = additionalTitles.filter((_, i) => i !== index);
      const newDates = additionalDates.filter((_, i) => i !== index);
      
      setLocalAdditionalTitles(newTitles);
      setLocalAdditionalDates(newDates);
      
      if (setAdditionalTitles) setAdditionalTitles(newTitles);
      if (setAdditionalDates) setAdditionalDates(newDates);
    }
  };

  const openCropModal = (index) => {
    if (isImage(documentView[index], index)) {
      setCurrentCropImage(documentView[index]);
      setCurrentCropIndex(index);
      setCurrentCropFile(value[index]);
      setCropModalOpen(true);
      setCrop({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
      });
    }
  };

  const closeCropModal = () => {
    setCropModalOpen(false);
    setCurrentCropImage(null);
    setCurrentCropIndex(null);
    setCurrentCropFile(null);
    setCompletedCrop(null);
    
    if (cropResolve) {
      cropResolve(null); 
      setCropResolve(null);
    }
  };

  const applyCrop = async () => {
    if (completedCrop && imgRef.current && currentCropFile) {
      setIsCompressing(true);
      
      try {
        const croppedFile = await getCroppedImg(
          imgRef.current,
          completedCrop,
          currentCropFile.name
        );
        
        const compressedCroppedFile = await compressImage(croppedFile, 1920, 1080, 0.6);
        
        if (currentCropIndex !== null) {
          const newDocuments = [...value];
          const newPreviews = [...documentView];
          newDocuments[currentCropIndex] = compressedCroppedFile;
          newPreviews[currentCropIndex] = URL.createObjectURL(compressedCroppedFile);
          
          setValue(newDocuments);
          setDocumentView(newPreviews);
        } else {
          if (cropResolve) {
            cropResolve(compressedCroppedFile);
            setCropResolve(null);
          }
        }
        
        setCropModalOpen(false);
        setCurrentCropImage(null);
        setCurrentCropIndex(null);
        setCurrentCropFile(null);
        setCompletedCrop(null);
      } catch (error) {
        console.error('Error cropping image:', error);
        alert('Failed to crop image. Please try again.');
        if (cropResolve) {
          cropResolve(null);
          setCropResolve(null);
        }
        closeCropModal();
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const skipCrop = () => {
    if (cropResolve) {
      cropResolve(currentCropFile);
      setCropResolve(null);
    }
    closeCropModal();
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "No Date") return "No Date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isImage = (doc, index) => {
    if (typeof doc === 'string' && doc.startsWith('blob:')) return true;
    if (value[index] && value[index].type) {
      return value[index].type.startsWith('image/');
    }
    return false;
  };

  const isPDF = (doc, index) => {
    if (value[index] && value[index].type) {
      return value[index].type === 'application/pdf';
    }
    return typeof doc === 'string' && doc.endsWith('.pdf');
  };

  return (
    <div className="flex flex-col items-center w-full">
      {isCompressing && (
        <div className="mb-4 text-sm text-blue-600 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          Compressing images...
        </div>
      )}
      
      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-thin">
        <div className="flex gap-3 p-2 w-max">
          {documentView.map((doc, index) => (
            <div key={index} className="relative w-40 flex-shrink-0 rounded-xl overflow-hidden">
              <motion.div
                className={`w-40 h-32 rounded-xl border-2 overflow-hidden ${
                  theme === "dark" ? "border-gray-600 bg-[#2a2b2d]" : "border-gray-200 bg-white"
                } shadow-lg`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {isImage(doc, index) ? (
                  <img
                    src={doc}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3">
                    <FileText size={24} className={theme === "dark" ? "text-gray-300" : "text-gray-600"} />
                    <span className={`text-xs mt-2 text-center truncate w-full ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {typeof doc === 'string' ? doc : 'PDF File'}
                    </span>
                  </div>
                )}
              </motion.div>

              {type === "additional" && additionalTitles[index] && (
                <div className={`absolute bottom-0 left-0 right-0 p-2 ${
                  theme === "dark" ? "bg-black/70" : "bg-white/90"
                } backdrop-blur-sm`}>
                  <div className="text-xs font-medium truncate text-blue-500">
                    {additionalTitles[index]}
                  </div>
                  {additionalDates[index] && additionalDates[index] !== "No Date" && (
                    <div className="flex items-center gap-1 text-xs opacity-75 text-blue-500">
                      <Calendar size={10} />
                      {formatDate(additionalDates[index])}
                    </div>
                  )}
                </div>
              )}

              <div className="absolute top-2 right-2 flex gap-1">
                {isImage(doc, index) && (
                  <button
                    onClick={() => openCropModal(index)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
                    title="Crop Image"
                  >
                    <Crop size={12} />
                  </button>
                )}
                {type === "additional" && (
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
                  >
                    <Edit3 size={12} />
                  </button>
                )}
                <button
                  onClick={() => removeDocument(index)}
                  className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}

          <motion.div
            className={`w-40 h-32 flex flex-col items-center justify-center rounded-xl cursor-pointer border-2 border-dashed flex-shrink-0 transition-colors hover:border-blue-400 ${
              isCompressing 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            } ${
              theme === "dark" ? "bg-[#1b1c1e] border-gray-600" : "bg-[#f7f7f7] border-gray-300"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => !isCompressing && document.getElementById(inputId).click()}
          >
            <img
              src={theme === "dark" ? add : addLight}
              className="w-12 h-12 mb-2"
              alt="Add"
            />
            <span className={`text-xs text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {t("Images & PDFs")}
            </span>
          </motion.div>
        </div>
      </div>

      <input
        type="file"
        accept="image/*,.pdf"
        multiple
        onChange={handleDocumentChange}
        className="hidden"
        id={inputId}
        disabled={isCompressing}
      />

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-auto rounded-2xl shadow-2xl ${
            theme === "dark" ? "bg-[#2a2b2d]" : "bg-white"
          }`}>
            <div className={`p-6 border-b ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"
                  }`}>
                    <Crop size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      {("Crop Image")}
                    </h3>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {("Adjust the crop area and apply changes")}
                    </p>
                  </div>
                </div>
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
            
            <div className="p-6">
              <div className="mb-6">
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
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={skipCrop}
                  className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                    theme === "dark" 
                      ? "border-gray-600 text-gray-300 hover:bg-[#1b1c1e] hover:border-gray-500" 
                      : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {t("Skip Crop")}
                </button>
                <button
                  onClick={applyCrop}
                  disabled={!completedCrop || isCompressing}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg transition-all ${
                    completedCrop && !isCompressing
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isCompressing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t("Processing...")}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      {t("Apply Crop")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            className={`rounded-2xl shadow-2xl w-full max-w-md ${
              theme === "dark" ? "bg-[#2a2b2d] text-white" : "bg-white text-black"
            }`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Modal Header */}
            <div className={`px-6 py-4 border-b ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"
                }`}>
                  {editIndex !== null ? <Edit3 size={20} className="text-blue-500" /> : <FileText size={20} className="text-blue-500" />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {editIndex !== null ? "Edit Document" : "Add Document Details"}
                  </h3>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {editIndex !== null ? "Update title and date" : "Provide title and date for your document"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <FileText size={16} />
                  {t("Document Title")}
                </label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    theme === "dark" 
                      ? "bg-[#1b1c1e] border-gray-600 text-white placeholder-gray-400 hover:border-gray-500" 
                      : "bg-gray-50 border-gray-200 text-black placeholder-gray-500 hover:border-gray-300"
                  }`}
                />
                <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  {t("docs_message")}
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  <Calendar size={16} />
                  {t('document_date')}
                </label>
                <input
                  type="date"
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    theme === "dark" 
                      ? "bg-[#1b1c1e] border-gray-600 text-white hover:border-gray-500" 
                      : "bg-gray-50 border-gray-200 text-black hover:border-gray-300"
                  }`}
                />
                <p className={`text-xs mt-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  {t("doc_date")}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t flex gap-3 justify-end ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}>
              <button
                onClick={handleModalCancel}
                className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${
                  theme === "dark" 
                    ? "border-gray-600 text-gray-300 hover:bg-[#1b1c1e] hover:border-gray-500" 
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {t("Cancel")}
              </button>
              <button
                onClick={handleModalSubmit}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {editIndex !== null ? t("Update") : t("add_document")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;