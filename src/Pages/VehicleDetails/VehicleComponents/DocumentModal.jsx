import React from "react";
import { useTheme } from "../../../Contexts/ThemeContext";
import { IoClose, IoDownload, IoEye } from "react-icons/io5";
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
          expiry: data.registrationExpiry,
          status: data.registrationStatus
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const isExpired = (dateString) => {
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
    link.download = `${documentType}_document_${index + 1}`;
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
                    isExpired(documentData.expiry) ? "text-red-500" : "text-blue-500"
                  }`}>
                    Expires: {formatDate(documentData.expiry)} 
                    {isExpired(documentData.expiry) && " (Expired)"}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-opacity-10 transition-colors ${
                  theme === "dark" ? " text-white" : " text-black"
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
                  {documentData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className={`relative group rounded-xl overflow-hidden ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                      } hover:shadow-lg transition-shadow`}
                    >
                      {/* Document Preview */}
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img
                          src={doc}
                          alt={`${documentData.title} ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='14' fill='%236b7280'%3EDocument%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        
                        {/* Overlay with actions */}
                        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleView(doc)}
                            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full"
                            title="View Document"
                          >
                            <IoEye size={20} />
                          </button>
                         
                        </div>
                      </div>
                      
                      {/* Document Info */}
                      <div className="p-4">
                        <h3 className={`font-medium truncate ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}>
                          {documentData.additionalTitles?.[index] || `Document ${index + 1}`}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}>
                          {documentData.title}
                        </p>
                      </div>
                    </div>
                  ))}
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