import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import verifiedicon from "./assets/verify.png";
import unverifiedicon from "./assets/unverify.png";
import { useTranslation } from "react-i18next";

function MaintenanceOverviewModal({ open, setOpen, maintenanceRecord }) {
    if (!open || !maintenanceRecord) return null;
    console.log("Maintenance Record Overview:", maintenanceRecord);

    const { theme } = useTheme();
    const [showTooltip, setShowTooltip] = useState(false);

    // Parse serviceLine if it's a string
    const parseServiceLine = (serviceLine) => {
        if (!serviceLine) return [];
        if (Array.isArray(serviceLine)) return serviceLine;
        if (typeof serviceLine === 'string') {
            try {
                return JSON.parse(serviceLine);
            } catch (error) {
                console.error('Error parsing serviceLine:', error);
                return [];
            }
        }
        return [];
    };

    const parsedServiceLine = parseServiceLine(maintenanceRecord.serviceLine);

    const InfoRow = ({ label, value }) => (
        <div className="flex justify-between items-center py-2 border-b border-opacity-20 border-gray-400">
            <p className="text-gray-400 text-sm">{label}</p>
            <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium`}>
                {value}
            </p>
        </div>
    );
    const { t } = useTranslation();

    return (
        <motion.div
            className="bg-black/50 backdrop-blur-lg fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full poppins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className={`rounded-xl w-[90%] max-w-2xl p-6 shadow flex flex-col gap-4
                    ${theme === "dark" ? "bg-[#323335] border-[#323335]" : "bg-white border-[#ECECEC]"}`}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                <div className="max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center w-full gap-2 justify-center relative pb-4 border-b border-opacity-20 border-gray-400">
                        <img
                            src={theme === "dark" ? back : backLight}
                            alt=""
                            className="w-[1.8rem] cursor-pointer absolute left-2"
                            onClick={() => setOpen(false)}
                        />
                        <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>
                            {t("Maintenance Record Overview")}
                        </p>
                    </div>

                    {/* Basic Information */}
                    <div className="mt-4">
                        <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                            {t("Basic Information")}
                        </h3>
                        <div className="space-y-1">
                            <InfoRow label={t("Date")} value={maintenanceRecord.date} />
                            <InfoRow label={t("Mileage")} value={maintenanceRecord.millage} />
                            <InfoRow label={t("Service Type")} value={maintenanceRecord.serviceType} />
                            <InfoRow label={t("Dealer Name")} value={maintenanceRecord.dealerName} />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold`}>
                                {t("Status")}
                            </h3>
                            <div className="relative">
                                <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-help
                                        ${theme === "dark" ? "border-gray-400 text-gray-400" : "border-gray-500 text-gray-500"}
                                        hover:${theme === "dark" ? "border-white text-white" : "border-black text-black"} 
                                        transition-colors duration-200`}
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                >
                                    <span className="text-xs font-bold leading-none">?</span>
                                </div>
                                
                                {/* Tooltip */}
                                {showTooltip && (
                                    <div className={`absolute left-6 top-0 z-10 px-3 py-2 rounded-lg shadow-lg min-w-[200px]
                                        ${theme === "dark" 
                                            ? "bg-gray-800 text-white border border-gray-600" 
                                            : "bg-white text-black border border-gray-200 shadow-md"
                                        }`}>
                                        <p className="text-sm">
                                            {maintenanceRecord.status === "0" 
                                                ? t("This maintenance record has not been verified by the authorized dealer or service center.")
                                                : t("This maintenance record has been verified and authenticated by the authorized dealer or service center.")
                                            }
                                        </p>
                                        {/* Arrow pointer */}
                                        <div className={`absolute left-[-6px] top-3 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px]
                                            ${theme === "dark" 
                                                ? "border-t-transparent border-b-transparent border-r-gray-800"
                                                : "border-t-transparent border-b-transparent border-r-white"
                                            }`}>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-opacity-10 bg-gray-500">
                            <img
                                src={maintenanceRecord.status === "0" ? unverifiedicon : verifiedicon}
                                alt={maintenanceRecord.status}
                                className="w-6 h-6"
                            />
                            <p className={`font-semibold ${maintenanceRecord.status === "0" ? "text-red-500" : "text-green-500"}`}>
                                {maintenanceRecord.status === "0" ? t("Unverified") : t("Verified")}
                            </p>
                        </div>
                    </div>

                    {/* Service Line Details */}
                    {parsedServiceLine && parsedServiceLine.length > 0 && (
                        <div className="mt-6">
                            <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                                {t("Service Line Details")}
                            </h3>
                            <div className="space-y-3">
                                {parsedServiceLine.map((service, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded-lg border
                                            ${theme === "dark"
                                                ? "bg-[#1b1c1e] border-gray-600"
                                                : "bg-[#f7f7f7] border-gray-200"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <p className="text-gray-400 text-sm">{t("Item Name")}</p>
                                                <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium`}>
                                                    {service.itemName}
                                                </p>
                                            </div>
                                            <div className="flex-1 ml-4">
                                                <p className="text-gray-400 text-sm">{t("Remarks")}</p>
                                                <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium`}>
                                                    {service.remarks}
                                                </p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Service Line Message */}
                    {(!parsedServiceLine || parsedServiceLine.length === 0) && (
                        <div className="mt-6">
                            <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                                {t("Service Line Details")}
                            </h3>
                            <div className={`p-4 rounded-lg text-center
                                ${theme === "dark"
                                    ? "bg-[#1b1c1e] text-gray-400"
                                    : "bg-[#f7f7f7] text-gray-500"
                                }`}>
                                <p>{t("No service line details available for this record.")}</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default MaintenanceOverviewModal;