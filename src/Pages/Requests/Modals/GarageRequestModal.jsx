import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoClose, IoCarSport, IoPersonSharp, IoCalendarOutline, IoDocumentTextOutline } from "react-icons/io5";

import { useTranslation } from "react-i18next";
import { useTheme } from "../../../Contexts/ThemeContext";

const GarageRequestModal = ({ setOpen, garageData }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");

  const garage = garageData?.garage;
  const car = garage?.car;

  const getStatusColor = (status) => {
    switch (status) {
      case "1": return "bg-green-500";
      case "0": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id
          ? "bg-[#489BF9] text-white"
          : theme === "dark"
          ? "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 p-4"
      onClick={() => setOpen(false)}
    >
      <motion.div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-xl ${
          theme === "dark" ? "bg-[#1f1f1f] text-white" : "bg-white text-black"
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-xl cursor-pointer z-10 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setOpen(false)}
        >
          <IoClose />
        </button>

        {/* Header */}
        <div className="relative  bg-gradient-to-br from-[#489BF9] to-[#357ABD] p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20">
              <img
                src={garage?.image || "/api/placeholder/64/64"}
                alt={garage?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{garage?.name}</h1>
              <p className="text-white/80">{garage?.email}</p>
              <div className="flex items-center gap-2 mt-2">
               
               
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto">
            <TabButton id="general" label={t("General Info")} icon={IoPersonSharp} />
            <TabButton id="car" label={t("Car Details")} icon={IoCarSport} />
            <TabButton id="maintenance" label={t("Maintenance")} icon={IoCalendarOutline} />
            <TabButton id="documents" label={t("Documents")} icon={IoDocumentTextOutline} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#489BF9]">{t("Contact Information")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{t("Phone")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{garage?.phNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("VAT Number")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{garage?.vatNum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("Username")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{garage?.userName}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#489BF9]">{t("Address")}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{t("City")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{garage?.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("ZIP Code")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{garage?.zipCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("Street")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{garage?.street}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("House Number")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{garage?.houseNum}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-[#489BF9]">{t("Account Details")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="font-medium">{t("Language")}:</span>
                    <span className="text-gray-600 dark:text-gray-300">{garage?.lang}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{t("Created At")}:</span>
                    <span className="text-gray-600 dark:text-gray-300">{formatDate(garage?.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{t("Notifications")}:</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {garage?.notification_status ? t("Enabled") : t("Disabled")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "car" && car && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <IoCarSport size={32} className="text-[#489BF9]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{car?.make} {car?.model}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{t("Number Plate")}: {car?.numberPlate}</p>
                  <p className="text-gray-600 dark:text-gray-300">{t("VIN")}: {car?.vinNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-[#489BF9]">{t("Vehicle Information")}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{t("Mileage")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{car?.mileage} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("Manufacturing Year")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{formatDate(car?.manufacturingYear)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("Owner")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{car?.owner_name}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-[#489BF9]">{t("Expiry Dates")}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{t("Insurance")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{formatDate(car?.insuranceExpiry)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("Registration")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{formatDate(car?.registrationExpiry)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t("Inspection")}:</span>
                      <span className="text-gray-600 dark:text-gray-300">{formatDate(car?.inspectionExpiry)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {car?.drivers && car.drivers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-[#489BF9]">{t("Assigned Drivers")}</h4>
                  <div className="space-y-2">
                    {car.drivers.map((driver, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <IoPersonSharp className="text-[#489BF9]" />
                        </div>
                        <div>
                          <p className="font-medium">{driver.driverName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{driver.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#489BF9]">{t("Maintenance History")}</h3>
              {car?.maintenance && car.maintenance.length > 0 ? (
                <div className="space-y-4">
                  {car.maintenance.map((record, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{record.serviceType}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {t("Date")}: {record.date} | {t("Mileage")}: {record.millage} km
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {t("Dealer")}: {record.dealerName}
                          </p>
                        </div>
                      </div>
                      
                      {record.serviceLine && record.serviceLine.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium">{t("Service Items")}:</h5>
                          {record.serviceLine.map((item, itemIndex) => (
                            <div key={itemIndex} className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                              <p className="font-medium">{item.itemName}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{item.remarks}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">{t("No maintenance records found")}</p>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#489BF9]">{t("Vehicle Documents")}</h3>
              
              {car?.registrationDocument && car.registrationDocument.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">{t("Registration Documents")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {car.registrationDocument.map((doc, index) => (
                      <img
                        key={index}
                        src={doc}
                        alt={`${t("Registration Document")} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    ))}
                  </div>
                </div>
              )}

              {car?.inspectionDocument && car.inspectionDocument.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">{t("Inspection Documents")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {car.inspectionDocument.map((doc, index) => (
                      <div key={index} className="space-y-2">
                        <img
                          src={doc.image}
                          alt={`${t("Inspection Document")} ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {t("Expiry")}: {formatDate(doc.expiry)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {car?.image && car.image.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold">{t("Vehicle Images")}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {car.image.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${t("Vehicle Image")} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GarageRequestModal;