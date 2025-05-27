import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import { IoClose } from "react-icons/io5";
import { FiUser, FiMail, FiPhone, FiFileText } from "react-icons/fi";

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
        opacity: 0, 
        scale: 0.8,
        transition: { duration: 0.2 }
    }
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const DriverDetailsModal = ({ isOpen, onClose, driverData }) => {
    const { theme } = useTheme();

    if (!driverData) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "0": return "bg-red-500";
            case "1": return "bg-yellow-500";
            case "2": return "bg-green-500";
            default: return "bg-gray-500";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "0": return "Inactive";
            case "1": return "Pending";
            case "2": return "Active";
            default: return "Unknown";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={handleOverlayClick}
                >
                    <motion.div
                        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl
                            ${theme === "dark" 
                                ? "bg-[#323335] text-white" 
                                : "bg-white text-black"
                            }`}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                            <h2 className="text-2xl font-bold">Driver Details</h2>
                            <motion.button
                                onClick={onClose}
                                className={`p-2 rounded-full transition-colors
                                    ${theme === "dark" 
                                        ? "hover:bg-gray-600" 
                                        : "hover:bg-gray-100"
                                    }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <IoClose size={24} />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Profile Section */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                                <motion.img
                                    src={driverData.image}
                                    alt={driverData.name}
                                    className="w-32 h-32 rounded-xl object-cover shadow-lg"
                                    whileHover={{ scale: 1.05 }}
                                />
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-3xl font-bold capitalize mb-2">
                                        {driverData.name} {driverData.lastName}
                                    </h3>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                                       
                                    </div>
                                    <p className="text-gray-500 mb-2">
                                        <span className="font-medium">Gender:</span> {driverData.gender}
                                    </p>
                                    <p className="text-gray-500">
                                        <span className="font-medium">VAT Number:</span> {driverData.vatNum}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <motion.div 
                                    className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-gray-50"}`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <FiMail className="text-blue-500" size={20} />
                                        <h4 className="font-semibold">Email</h4>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{driverData.email}</p>
                                    
                                </motion.div>

                                <motion.div 
                                    className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-gray-50"}`}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <FiPhone className="text-blue-500" size={20} />
                                        <h4 className="font-semibold">Phone</h4>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">{driverData.phNumber}</p>
                                </motion.div>
                            </div>

                            {/* Driver Details Images */}
                            {driverData.details && driverData.details.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                        <FiFileText className="text-blue-500" />
                                        Driver Details
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {driverData.details.map((detail, index) => (
                                            <motion.img
                                                key={index}
                                                src={detail}
                                                alt={`Driver detail ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer"
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => window.open(detail, '_blank')}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Documents */}
                            {driverData.documents && driverData.documents.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                                        <FiFileText className="text-blue-500" />
                                        Documents
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {driverData.documents.map((document, index) => (
                                            <motion.img
                                                key={index}
                                                src={document}
                                                alt={`Document ${index + 1}`}
                                                className="w-full h-40 object-cover rounded-lg shadow-md cursor-pointer"
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => window.open(document, '_blank')}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Information */}
                            <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-gray-50"}`}>
                                <h4 className="font-semibold mb-3">Additional Information</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                   
                                  
                                    <div>
                                        <span className="font-medium">Created:</span>
                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                            {new Date(driverData.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Last Updated:</span>
                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                            {new Date(driverData.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DriverDetailsModal;