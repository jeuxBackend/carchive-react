import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Calendar, FileText, AlertTriangle, CheckCircle, XCircle, EyeOff } from 'lucide-react';
import { useTheme } from '../../Contexts/ThemeContext';
import BlueButton from '../../Components/Buttons/BlueButton';
import { adminReleaseVehicle } from '../../API/adminServices';
import { toast } from 'react-toastify';

const VehicleDetailsModal = ({ isOpen, onClose, vehicleData, fetchVehicles }) => {
    const { theme } = useTheme();
    const [loading, setLoading] = React.useState(false);
    console.log("selected vehicle data:", vehicleData);


    if (!vehicleData) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysUntilExpiry = (dateString) => {
        if (!dateString) return null;

        const expiryDate = new Date(dateString);
        expiryDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const timeDiff = expiryDate.getTime() - today.getTime();
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    };

    const getExpiryStatus = (dateString) => {
        if (!dateString) return { status: 'unknown', message: 'No date provided', color: 'text-gray-500' };

        const daysUntilExpiry = getDaysUntilExpiry(dateString);

        if (daysUntilExpiry < 0) {
            return {
                status: 'expired',
                message: `Expired ${Math.abs(daysUntilExpiry)} day${Math.abs(daysUntilExpiry) !== 1 ? 's' : ''} ago`,
                color: 'text-red-600'
            };
        } else if (daysUntilExpiry === 0) {
            return {
                status: 'expires-today',
                message: 'Expires today',
                color: 'text-red-600'
            };
        } else if (daysUntilExpiry <= 7) {
            return {
                status: 'critical',
                message: `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`,
                color: 'text-red-600'
            };
        } else if (daysUntilExpiry <= 30) {
            return {
                status: 'warning',
                message: `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`,
                color: 'text-orange-600'
            };
        } else {
            return {
                status: 'valid',
                message: `Expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}`,
                color: 'text-green-600'
            };
        }
    };

    const getStatusIcon = (status, expiryDate) => {
        if (status === 0) {
            return <EyeOff className="w-4 h-4 text-gray-500" />;
        }

        const expiryStatus = getExpiryStatus(expiryDate);
        if (expiryStatus.status === 'expired' || expiryStatus.status === 'expires-today') {
            return <XCircle className="w-4 h-4 text-red-600" />;
        } else if (expiryStatus.status === 'critical' || expiryStatus.status === 'warning') {
            return <AlertTriangle className="w-4 h-4 text-orange-600" />;
        }

        return <CheckCircle className="w-4 h-4 text-green-600" />;
    };

    const getStatusText = (status, expiryDate) => {
        if (status === 0) return 'Hidden';

        const expiryStatus = getExpiryStatus(expiryDate);
        return expiryStatus.status === 'expired' ? 'Expired' :
            expiryStatus.status === 'expires-today' ? 'Expires Today' :
                expiryStatus.status === 'critical' ? 'Expiring Soon' :
                    expiryStatus.status === 'warning' ? 'Valid (Expiring Soon)' : 'Valid';
    };

    const getStatusColor = (status, expiryDate) => {
        if (status === 0) return 'text-gray-500';
        return getExpiryStatus(expiryDate).color;
    };

    const parseDocuments = (docString) => {
        if (!docString) return [];
        try {
            return JSON.parse(docString);
        } catch {
            return [];
        }
    };

    const releaseCar = async () => {
        try {
            setLoading(true);
            const response = adminReleaseVehicle({ id: vehicleData.id });
            if (response) {
                toast.success("Vehicle released successfully");
                onClose();
                fetchVehicles();
            }
        } catch (error) {
            toast.error("Failed to release vehicle");
        } finally {
            setLoading(false);
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-xs"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`${theme === "dark" ? "bg-[#323335]" : "bg-white"} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`sticky top-0 ${theme === "dark" ? "bg-[#323335] border-gray-600" : "bg-white border-gray-200"} border-b px-6 py-4 flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                <Car className="w-6 h-6 text-blue-600" />
                                <div>
                                    <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                                        {vehicleData.make} {vehicleData.model}
                                    </h2>
                                    <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                                        Plate: {vehicleData.numberPlate || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className={`p-2 ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-100"} rounded-full transition-colors`}
                            >
                                <X className={`w-5 h-5 ${theme === "dark" ? "text-gray-300" : "text-gray-500"}`} />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Vehicle Images */}
                            {/* Vehicle Images */}
                            {vehicleData?.image && (
                                <div className="mb-6">
                                    <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-800"} mb-3`}>Vehicle Images</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Array.isArray(vehicleData.image) ? (
                                            vehicleData.image.map((img, index) => (
                                                <div key={index} className={`aspect-video ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-gray-100"} rounded-lg overflow-hidden`}>
                                                    <img
                                                        src={img}
                                                        alt={`Vehicle ${index + 1}`}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDEyNSA3NUgxNzVMMTUwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                                        }}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div className={`aspect-video ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-gray-100"} rounded-lg overflow-hidden`}>
                                                <img
                                                    src={vehicleData.image}
                                                    alt="Vehicle"
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                                    onError={(e) => {
                                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwTDEyNSA3NUgxNzVMMTUwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Basic Information */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white border-gray-600" : "text-gray-800 border-gray-200"} border-b pb-2`}>Basic Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Make:</span>
                                            <span className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{vehicleData.make}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Model:</span>
                                            <span className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{vehicleData.model}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Number Plate:</span>
                                            <span className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{vehicleData.numberPlate || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>VIN Number:</span>
                                            <span className={`font-medium text-xs ${theme === "dark" ? "text-white" : "text-black"}`}>{vehicleData.vinNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Mileage:</span>
                                            <span className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{vehicleData.mileage} miles</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Manufacturing Year:</span>
                                            <span className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{formatDate(vehicleData.manufacturingYear)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Document Status */}
                                <div className="space-y-4">
                                    <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white border-gray-600" : "text-gray-800 border-gray-200"} border-b pb-2`}>Document Status</h3>
                                    <div className="space-y-3">
                                        {/* Insurance Status */}
                                        <div className={`flex items-center justify-between p-3 ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-gray-50"} rounded-lg`}>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(vehicleData.insuranceStatus, vehicleData.insuranceExpiry)}
                                                <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Insurance</span>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-medium ${getStatusColor(vehicleData.insuranceStatus, vehicleData.insuranceExpiry)}`}>
                                                    {getStatusText(vehicleData.insuranceStatus, vehicleData.insuranceExpiry)}
                                                </div>
                                                {vehicleData.insuranceExpiry && (
                                                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                        {getExpiryStatus(vehicleData.insuranceExpiry).message}
                                                    </div>
                                                )}
                                                {vehicleData.insuranceStatus === 1 &&
                                                    getExpiryStatus(vehicleData.insuranceExpiry).status === 'critical' && (
                                                        <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            Expiring Soon
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Registration Status */}
                                        <div className={`flex items-center justify-between p-3 ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-gray-50"} rounded-lg`}>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(vehicleData.registrationStatus, vehicleData.registrationExpiry)}
                                                <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Registration</span>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-medium ${getStatusColor(vehicleData.registrationStatus, vehicleData.registrationExpiry)}`}>
                                                    {getStatusText(vehicleData.registrationStatus, vehicleData.registrationExpiry)}
                                                </div>
                                                {vehicleData.registrationExpiry && (
                                                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                        {getExpiryStatus(vehicleData.registrationExpiry).message}
                                                    </div>
                                                )}
                                                {vehicleData.registrationStatus === 1 &&
                                                    getExpiryStatus(vehicleData.registrationExpiry).status === 'critical' && (
                                                        <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            Expiring Soon
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Inspection Status */}
                                        <div className={`flex items-center justify-between p-3 ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-gray-50"} rounded-lg`}>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(vehicleData.inspectionStatus, vehicleData.inspectionExpiry)}
                                                <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>Inspection</span>
                                            </div>
                                            <div className="text-right">
                                                <div className={`font-medium ${getStatusColor(vehicleData.inspectionStatus, vehicleData.inspectionExpiry)}`}>
                                                    {getStatusText(vehicleData.inspectionStatus, vehicleData.inspectionExpiry)}
                                                </div>
                                                {vehicleData.inspectionExpiry && (
                                                    <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                                        {getExpiryStatus(vehicleData.inspectionExpiry).message}
                                                    </div>
                                                )}
                                                {vehicleData.inspectionStatus === 1 &&
                                                    getExpiryStatus(vehicleData.inspectionExpiry).status === 'critical' && (
                                                        <div className="flex items-center gap-1 text-orange-600 text-xs mt-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            Expiring Soon
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Documents */}
                            {vehicleData.additionalTitles && vehicleData.additionalTitles.length > 0 && (
                                <div className="mb-6">
                                    <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white border-gray-600" : "text-gray-800 border-gray-200"} border-b pb-2 mb-4`}>Additional Documents</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {vehicleData.additionalTitles.map((title, index) => (
                                            title && (
                                                <div key={index} className={`flex items-center gap-2 p-3 ${theme === "dark" ? "bg-blue-900/50" : "bg-blue-50"} rounded-lg`}>
                                                    <FileText className="w-4 h-4 text-blue-600" />
                                                    <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"}`}>{title}</span>
                                                    {vehicleData.additionalExpiry && vehicleData.additionalExpiry[index] && (
                                                        <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"} ml-auto`}>
                                                            Expires: {formatDate(vehicleData.additionalExpiry[index])}
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* System Information */}
                            <div className={`border-t ${theme === "dark" ? "border-gray-600" : "border-gray-200"} pt-4`}>
                                <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-800"} mb-3`}>System Information</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Created:</span>
                                        <div className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{formatDate(vehicleData.created_at)}</div>
                                    </div>
                                    <div>
                                        <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Updated:</span>
                                        <div className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{formatDate(vehicleData.updated_at)}</div>
                                    </div>
                                    <div>
                                        <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Vehicle ID:</span>
                                        <div className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{vehicleData.id}</div>
                                    </div>
                                    <div>
                                        <span className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>Company ID:</span>
                                        <div className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>{vehicleData.companyId || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <div
                                    className={`w-full py-3 px-3 cursor-pointer xl:text-[1rem] lg:text-[0.6rem] text-center 2xl:px-4 flex justify-center items-center rounded-xl focus:outline-none ${theme === "dark" ? "bg-[#479cff] text-white" : "bg-[#1b1c1e] text-white "
                                        }`}
                                    onClick={releaseCar}
                                >
                                    {loading ? (
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin"
                                        />
                                    ) : (" Release Car")}


                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default VehicleDetailsModal;