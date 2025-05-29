import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import verifiedicon from "./assets/verify.png";
import unverifiedicon from "./assets/unverify.png";
import { useTranslation } from "react-i18next";

function MaintenanceOverviewModal({ open, setOpen, maintenanceRecord }) {
    if (!open || !maintenanceRecord) return null;

    const { theme } = useTheme();

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
                            <InfoRow label={t("Record ID")} value={`#${maintenanceRecord.id}`} />
                            <InfoRow label={t("Date")} value={maintenanceRecord.date} />
                            <InfoRow label={t("Mileage")} value={maintenanceRecord.millage} />
                            <InfoRow label={t("Service Type")} value={maintenanceRecord.serviceType} />
                            <InfoRow label={t("Dealer Name")} value={maintenanceRecord.dealerName} />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mt-6">
                        <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                            {t("Status")}
                        </h3>
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
                    {maintenanceRecord.serviceLine && maintenanceRecord.serviceLine.length > 0 && (
                        <div className="mt-6">
                            <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                                {t("Service Line Details")}
                            </h3>
                            <div className="space-y-3">
                                {maintenanceRecord.serviceLine.map((service, index) => (
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
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-opacity-10 bg-gray-500">
                                            <img
                                                src={service.status === "0" ? unverifiedicon : verifiedicon}
                                                alt={service.status}
                                                className="w-6 h-6"
                                            />
                                            <p className={`font-semibold ${service.status === "0" ? "text-red-500" : "text-white"}`}>
                                                {service.status === "0" ? "Unverified" : "Verified"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Service Line Message */}
                    {(!maintenanceRecord.serviceLine || maintenanceRecord.serviceLine.length === 0) && (
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

                    {/* Additional Information */}
                    <div className="mt-6">
                        <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                            {t("Additional Information")}
                        </h3>
                        <div className="space-y-1">
                            <InfoRow label={t("VIN Number")} value={maintenanceRecord.vinNumber} />
                            <InfoRow label={t("Created At")} value={new Date(maintenanceRecord.created_at).toLocaleString()} />
                            <InfoRow label={t("Updated At")} value={new Date(maintenanceRecord.updated_at).toLocaleString()} />
                        </div>
                    </div>


                </div>
            </motion.div>
        </motion.div>
    );
}

export default MaintenanceOverviewModal;