import React, { useState, useCallback } from "react";
import { useTheme } from "../../../Contexts/ThemeContext";
import Switch from "../../../Components/Buttons/Switch";
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { releaseVehicle, updateVehicle } from "../../../API/portalServices";
import { toast } from "react-toastify";
import InsuranceSwitch from "../../../Components/Buttons/InsuranceSwitch";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Services({ data, setLoading }) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Local state to manage switch states for immediate UI updates
  const [localSwitchStates, setLocalSwitchStates] = useState({
    insuranceStatus: data?.insuranceStatus || 0,
    inspectionStatus: data?.inspectionStatus || 0,
    additionalStatus: data?.additionalStatus || 0,
  });

  // Loading states for individual switches
  const [switchLoading, setSwitchLoading] = useState({
    insuranceStatus: false,
    inspectionStatus: false,
    additionalStatus: false,
  });

  // Debounced API calls to prevent rapid toggles
  const [debounceTimers, setDebounceTimers] = useState({});

  const updateStatusInBackground = useCallback(async (id, statusField, newStatus, originalStatus) => {
    try {
      setSwitchLoading(prev => ({ ...prev, [statusField]: true }));
      
      // Create the update payload with all status fields
      // Send all statuses, with the changed one having the new value
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

      // Revert the local state if API call fails
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

    // Clear existing debounce timer for this field
    if (debounceTimers[statusField]) {
      clearTimeout(debounceTimers[statusField]);
    }

    // Update UI immediately for better UX
    setLocalSwitchStates(prev => ({
      ...prev,
      [statusField]: newStatus
    }));

    // Debounce the API call (300ms delay)
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

    // Confirm before releasing
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

  // Helper function to format date display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  // Check expiration status
  const isExpired = (dateString) => {
    if (!dateString) return false;
    try {
      return new Date(dateString) < new Date();
    } catch {
      return false;
    }
  };

  const isInsuranceExpired = isExpired(data?.insuranceExpiry);
  const isInspectionExpired = isExpired(data?.inspectionExpiry);
  const isAdditionalExpired = Array.isArray(data?.additionalExpiry) && 
                              data.additionalExpiry[0] && 
                              isExpired(data.additionalExpiry[0]);

  const serviceItems = [
    {
      title: "Insurance",
      subtitle: data?.insuranceExpiry ? `(${formatDate(data.insuranceExpiry)})` : "",
      expired: isInsuranceExpired ? "Expired" : "",
      showSwitch: true,
      switchChecked: localSwitchStates.insuranceStatus === 1,
      switchLoading: switchLoading.insuranceStatus,
      onToggle: () => handleSwitchToggle('insuranceStatus'),
      statusField: 'insuranceStatus',
    },
    {
      title: "Inspection Documents",
      subtitle: data?.inspectionExpiry ? `(${formatDate(data.inspectionExpiry)})` : "",
      expired: isInspectionExpired ? "Expired" : "",
      showSwitch: true,
      switchChecked: localSwitchStates.inspectionStatus === 1,
      switchLoading: switchLoading.inspectionStatus,
      onToggle: () => handleSwitchToggle('inspectionStatus'),
      statusField: 'inspectionStatus',
    },
    {
      title: "Additional Documents",
      subtitle: Array.isArray(data?.additionalExpiry) && data.additionalExpiry[0]
        ? `(${formatDate(data.additionalExpiry[0])})`
        : "",
      expired: isAdditionalExpired ? "Expired" : "",
      showSwitch: true,
      switchChecked: localSwitchStates.additionalStatus === 1,
      switchLoading: switchLoading.additionalStatus,
      onToggle: () => handleSwitchToggle('additionalStatus'),
      statusField: 'additionalStatus',
    },
    {
      title: "Maintenance Records",
      showArrow: true,
      route: `/VehicleMaintenence/${data?.id}`,
    },
    {
      title: "Release Vehicle",
      showArrow: false,
      func: () => releaseCar(data?.id),
      dangerous: true,
    },
  ];

  // Cleanup debounce timers on unmount
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
          className={`w-full rounded-xl p-4 2xl:p-5 ${
            theme === "dark"
              ? "bg-[#323335]"
              : "bg-white border border-[#ececec]"
          } shadow-md flex items-center justify-between ${
            item.func || item.route ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''
          } ${item.dangerous ? 'hover:border-red-300' : ''}`}
          variants={itemVariants}
          onClick={(e) => {
            // Only handle card click for non-switch items
            if (!item.showSwitch) {
              if (item.func) {
                item.func();
              } else if (item.route) {
                navigate(item.route);
              }
            }
          }}
        >
          <div className="flex items-center gap-2">
            <p
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } text-[1.4rem] font-medium ${
                item.dangerous ? 'text-red-600' : ''
              }`}
            >
              {item.title}
            </p>
            {item.subtitle && (
              <p className="text-[#2D9BFF] text-[0.8rem] font-medium">
                {item.subtitle}{" "}
                <span className="text-red-500 font-semibold">{item.expired}</span>
              </p>
            )}
          </div>
          
          {item.showSwitch && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
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
              className={`text-[1.4rem] ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Services;