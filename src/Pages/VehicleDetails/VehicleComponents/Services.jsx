import React, { useState, useCallback } from "react";
import { useTheme } from "../../../Contexts/ThemeContext";
import Switch from "../../../Components/Buttons/Switch";
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { releaseVehicle, updateVehicle } from "../../../API/portalServices";
import { toast } from "react-toastify";
import InsuranceSwitch from "../../../Components/Buttons/InsuranceSwitch";
import { useTranslation } from 'react-i18next';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Services({ data, setLoading }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [localSwitchStates, setLocalSwitchStates] = useState({
    insuranceStatus: data?.insuranceStatus || 0,
    inspectionStatus: data?.inspectionStatus || 0,
    additionalStatus: data?.additionalStatus || 0,
  });

  const [switchLoading, setSwitchLoading] = useState({
    insuranceStatus: false,
    inspectionStatus: false,
    additionalStatus: false,
  });

  const [debounceTimers, setDebounceTimers] = useState({});

  const updateStatusInBackground = useCallback(async (id, statusField, newStatus, originalStatus) => {
    try {
      setSwitchLoading(prev => ({ ...prev, [statusField]: true }));

      const currentStates = { ...localSwitchStates };
      currentStates[statusField] = newStatus;

      const updatePayload = {
        id,
        insuranceStatus: currentStates.insuranceStatus,
        inspectionStatus: currentStates.inspectionStatus,
        additionalStatus: currentStates.additionalStatus,
      };

      const response = await updateVehicle(updatePayload);

      if (response.data) {
        const fieldName = statusField.replace('Status', '').charAt(0).toUpperCase() +
          statusField.replace('Status', '').slice(1);
        toast.success(`The document status has been updated and is now available for viewing.`);
      }
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.message ||
        `Failed to update ${statusField.replace('Status', '')} status`;

      toast.error(errorMessage);

      setLocalSwitchStates(prev => ({
        ...prev,
        [statusField]: originalStatus
      }));
    } finally {
      setSwitchLoading(prev => ({ ...prev, [statusField]: false }));
    }
  }, [localSwitchStates]);

  const handleSwitchToggle = useCallback((statusField) => {
    const currentStatus = localSwitchStates[statusField];
    const newStatus = currentStatus === 1 ? 0 : 1;

    if (debounceTimers[statusField]) {
      clearTimeout(debounceTimers[statusField]);
    }

    setLocalSwitchStates(prev => ({
      ...prev,
      [statusField]: newStatus
    }));

    const timer = setTimeout(() => {
      updateStatusInBackground(data?.id, statusField, newStatus, currentStatus);
    }, 300);

    setDebounceTimers(prev => ({
      ...prev,
      [statusField]: timer
    }));
  }, [localSwitchStates, debounceTimers, updateStatusInBackground, data?.id]);

  const releaseCar = async (id) => {
    if (!id) {
      toast.error("Vehicle ID is required");
      return;
    }

    if (!window.confirm("Are you sure you want to release this vehicle?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await releaseVehicle(id);
      if (response.data) {
        toast.success("Vehicle Released Successfully");
        navigate("/Vehicles");
      }
    } catch (error) {
      console.error('Release Error:', error);
      const errorMessage = error.response?.data?.message || "Failed to release vehicle";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  // New function to check if expiry is within a month
  const isExpiringSoon = (dateString) => {
    if (!dateString) return false;
    try {
      const expiryDate = new Date(dateString);
      const currentDate = new Date();
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(currentDate.getMonth() + 1);
      
      return expiryDate <= oneMonthFromNow && expiryDate >= currentDate;
    } catch {
      return false;
    }
  };

  const isInsuranceExpired = isExpired(data?.insuranceExpiry);
  const isInspectionExpired = isExpired(data?.inspectionExpiry);
  const isAdditionalExpired = Array.isArray(data?.additionalExpiry) &&
    data.additionalExpiry[0] &&
    isExpired(data.additionalExpiry[0]);

  const isInsuranceExpiringSoon = isExpiringSoon(data?.insuranceExpiry);
  const isInspectionExpiringSoon = isExpiringSoon(data?.inspectionExpiry);
  const isAdditionalExpiringSoon = Array.isArray(data?.additionalExpiry) &&
    data.additionalExpiry[0] &&
    isExpiringSoon(data.additionalExpiry[0]);

  const serviceItems = [
    {
      title: t('insurance'),
      subtitle: data?.insuranceExpiry ? `(${formatDate(data.insuranceExpiry)})` : "",
      expired: isInsuranceExpired ? t('expired') : "",
      expiringSoon: isInsuranceExpiringSoon ? t('expires_soon') || 'EXPIRES SOON' : "",
      showSwitch: true,
      switchChecked: localSwitchStates.insuranceStatus === 1,
      switchLoading: switchLoading.insuranceStatus,
      onToggle: () => handleSwitchToggle('insuranceStatus'),
      statusField: 'insuranceStatus',
    },
    {
      title: t('inspection_documents'),
      subtitle: data?.inspectionExpiry ? `(${formatDate(data.inspectionExpiry)})` : "",
      expired: isInspectionExpired ? t('expired') : "",
      expiringSoon: isInspectionExpiringSoon ? t('expires_soon') || 'EXPIRES SOON' : "",
      showSwitch: true,
      switchChecked: localSwitchStates.inspectionStatus === 1,
      switchLoading: switchLoading.inspectionStatus,
      onToggle: () => handleSwitchToggle('inspectionStatus'),
      statusField: 'inspectionStatus',
    },
    {
      title: t('additional_documents'),
      subtitle: Array.isArray(data?.additionalExpiry) && data.additionalExpiry[0]
        ? `(${formatDate(data.additionalExpiry[0])})`
        : "",
      expired: isAdditionalExpired ? t('expired') : "",
      expiringSoon: isAdditionalExpiringSoon ? t('expires_soon') || 'EXPIRES SOON' : "",
      showSwitch: true,
      switchChecked: localSwitchStates.additionalStatus === 1,
      switchLoading: switchLoading.additionalStatus,
      onToggle: () => handleSwitchToggle('additionalStatus'),
      statusField: 'additionalStatus',
    },
    {
      title: t('maintenance_records'),
      showArrow: true,
      route: `/VehicleMaintenence/${data?.id}`,
    }
  ];

  React.useEffect(() => {
    return () => {
      Object.values(debounceTimers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [debounceTimers]);

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {serviceItems.map((item, index) => (
        <motion.div
          key={index}
          className={`w-full rounded-xl p-3 sm:p-4 2xl:p-5 ${theme === "dark"
              ? "bg-[#323335]"
              : "bg-white border border-[#ececec]"
            } shadow-md ${item.func || item.route ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
            } ${item.dangerous ? 'hover:border-red-300' : ''}`}
          variants={itemVariants}
          onClick={(e) => {
            if (!item.showSwitch) {
              if (item.func) {
                item.func();
              } else if (item.route) {
                navigate(item.route);
              }
            }
          }}
        >
          {/* Mobile Layout (screens < 640px) */}
          <div className="sm:hidden">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p
                  className={`${theme === "dark" ? "text-white" : "text-black"
                    } text-base font-medium truncate ${item.dangerous ? 'text-red-600' : ''
                    }`}
                >
                  {item.title}
                </p>
              </div>
              
              {item.showArrow && (
                <IoIosArrowForward
                  className={`text-lg flex-shrink-0 ${theme === "dark" ? "text-white" : "text-black"
                    }`}
                />
              )}
            </div>
            
            {item.subtitle && (
              <div className="mb-2">
                <p className="text-[#2D9BFF] text-xs font-medium break-words">
                  {item.subtitle}{" "}
                  <span className="text-red-500 font-semibold">{item.expired}</span>
                  <span className="text-yellow-500 font-semibold ml-1">{item.expiringSoon}</span>
                </p>
              </div>
            )}

            {item.showSwitch && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex items-center justify-between"
              >
                <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {t('share')}
                </span>
                <div className="flex items-center gap-2">
                  <InsuranceSwitch
                    checked={item.switchChecked}
                    disabled={item.switchLoading}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (!item.switchLoading) {
                        item.onToggle();
                      }
                    }}
                  />
                  {item.switchLoading && (
                    <div className="absolute right-0 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Layout (screens >= 640px) */}
          <div className="hidden sm:flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <p
                className={`${theme === "dark" ? "text-white" : "text-black"
                  } text-lg lg:text-xl font-medium truncate ${item.dangerous ? 'text-red-600' : ''
                  }`}
              >
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-[#2D9BFF] text-sm font-medium break-words">
                  {item.subtitle}{" "}
                  <span className="text-red-500 font-semibold">{item.expired}</span>
                  <span className="text-yellow-500 font-semibold ml-1">{item.expiringSoon}</span>
                </p>
              )}
            </div>

            {item.showSwitch && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="relative flex items-center gap-2 flex-shrink-0"
              >
                <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  {t('share')}
                </span>
                <InsuranceSwitch
                  checked={item.switchChecked}
                  disabled={item.switchLoading}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (!item.switchLoading) {
                      item.onToggle();
                    }
                  }}
                />
                {item.switchLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            )}

            {item.showArrow && (
              <IoIosArrowForward
                className={`text-xl flex-shrink-0 ${theme === "dark" ? "text-white" : "text-black"
                  }`}
              />
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Services;