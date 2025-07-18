import React from "react";
import { useTheme } from "../../../Contexts/ThemeContext";
import { IoClose, IoDownload, IoEye, IoDocument } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';

const DocumentModal = ({ isOpen, onClose, documentType, data }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  if (!isOpen || !data) return null;

  const getDocumentData = () => {
    switch (documentType) {
      case 'insurance':
        return {
          title: t('insurance'),
          documents: data.insuranceDocument || [],
          expiry: data.insuranceExpiry,
          status: data.insuranceStatus
        };
      case 'inspection':
        return {
          title: t('inspection_documents'),
          documents: data.inspectionDocument?.map(doc => doc.image) || [],
          expiry: data.inspectionExpiry,
          status: data.inspectionStatus
        };
      case 'additional':
        return {
          title: t('additional_documents'),
          documents: data.additionalDocuments || [],
          expiry: data.additionalExpiry?.[0],
          status: data.additionalStatus,
          additionalTitles: data.additionalTitles || []
        };
      case 'registration':
        return {
          title: 'Registration Documents',
          documents: data.registrationDocument || [],
        };
      default:
        return {
          title: 'Documents',
          documents: [],
          expiry: null,
          status: 0
        };
    }
  };

  const documentData = getDocumentData();

  // Helper function to determine file type
  const getFileType = (url) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image';
    } else if (extension === 'pdf') {
      return 'pdf';
    }
    return 'unknown';
  };

  // Helper function to get file extension
  const getFileExtension = (url) => {
    if (!url) return '';
    return url.split('.').pop().toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const isExpiblue = (dateString) => {
    if (!dateString) return false;
    try {
      return new Date(dateString) < new Date();
    } catch {
      return false;
    }
  };

  const handleDownload = (url, index) => {
    const link = document.createElement('a');
    link.href = url;
    const fileExtension = getFileExtension(url).toLowerCase();
    link.download = `${documentType}_document_${index + 1}.${fileExtension}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (url) => {
    window.open(url, '_blank');
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const renderDocumentPreview = (doc, index) => {
    const fileType = getFileType(doc);
    const fileExtension = getFileExtension(doc);

    if (fileType === 'image') {
      return (
        <img
          src={doc}
          alt={`${documentData.title} ${index + 1}`}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EImage Error%3C/text%3E%3C/svg%3E";
          }}
        />
      );
    } else if (fileType === 'pdf') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20">
          <IoDocument size={48} className="text-blue-500 mb-3" />
          <span className="text-blue-600 dark:text-blue-400 font-medium text-lg">PDF</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Click to view
          </span>
        </div>
      );
    } else {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700">
          <IoDocument size={48} className="text-gray-400 mb-3" />
          <span className="text-gray-500 dark:text-gray-400 font-medium">{fileExtension}</span>
          <span className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Click to view
          </span>
        </div>
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm bg-opacity-50" />
          
          {/* Modal Content */}
          <motion.div
            className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl ${
              theme === "dark" ? "bg-[#323335]" : "bg-white"
            } shadow-2xl`}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === "dark" ? "border-gray-600" : "border-gray-200"
            }`}>
              <div>
                <h2 className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}>
                  {documentData.title}
                </h2>
                {documentData.expiry && (
                  <p className={`text-sm mt-1 ${
                    isExpiblue(documentData.expiry) ? "text-blue-500" : "text-blue-500"
                  }`}>
                    Expires: {formatDate(documentData.expiry)} 
                    {isExpiblue(documentData.expiry) && " (Expiblue)"}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-opacity-10 transition-colors ${
                  theme === "dark" ? "hover:bg-white text-white" : "hover:bg-black text-black"
                }`}
              >
                <IoClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {documentData.documents.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`text-6xl mb-4 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-300"
                  }`}>
                    📄
                  </div>
                  <p className={`text-lg ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}>
                    No documents available
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documentData.documents.map((doc, index) => {
                    const fileType = getFileType(doc);
                    const fileExtension = getFileExtension(doc);
                    
                    return (
                      <div
                        key={index}
                        className={`relative group rounded-xl overflow-hidden ${
                          theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                        } hover:shadow-lg transition-shadow cursor-pointer`}
                        onClick={() => handleView(doc)}
                      >
                        {/* Document Preview */}
                        <div className="aspect-[3/4] relative overflow-hidden">
                          {renderDocumentPreview(doc, index)}
                          
                          {/* Overlay with actions - only show for images */}
                          {fileType === 'image' && (
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(doc);
                                }}
                                className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full"
                                title="View Document"
                              >
                                <IoEye size={20} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(doc, index);
                                }}
                                className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
                                title="Download Document"
                              >
                                <IoDownload size={20} />
                              </button>
                            </div>
                          )}
                          
                          {/* PDF overlay - always visible */}
                          {fileType === 'pdf' && (
                            <div className="absolute top-2 right-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(doc, index);
                                }}
                                className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200"
                                title="Download PDF"
                              >
                                <IoDownload size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* Document Info */}
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium truncate ${
                              theme === "dark" ? "text-white" : "text-black"
                            }`}>
                              {documentData.additionalTitles?.[index] || `Document ${index + 1}`}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              fileType === 'pdf' 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                : fileType === 'image' 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}>
                              {fileExtension}
                            </span>
                          </div>
                          <p className={`text-sm mt-1 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}>
                            {documentData.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentModal;