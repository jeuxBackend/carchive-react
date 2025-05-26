import React, { useState } from "react";
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

  const updateStatusInBackground = async (id, type, newStatus, originalStatus) => {
    try {
      const response = await updateVehicle({
        id,
        type,
        status: newStatus
      });
      if (response.data) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} Status Updated Successfully`);
      }
    } catch (error) {
      console.error(error.response);
      toast.error(error.response?.data?.message || `Failed to update ${type} status`);

      // Revert the local state if API call fails
      setLocalSwitchStates(prev => ({
        ...prev,
        [`${type}Status`]: originalStatus
      }));
    }
  };

  const handleSwitchToggle = (type) => {
    const currentStatus = localSwitchStates[`${type}Status`];
    const newStatus = currentStatus === 1 ? 0 : 1;

    setLocalSwitchStates(prev => ({
      ...prev,
      [`${type}Status`]: newStatus
    }));

    updateStatusInBackground(data?.id, type, newStatus, currentStatus);
  };

  const releaseCar = async (id) => {
    setLoading(true);
    try {
      const response = await releaseVehicle(id);
      if (response.data) {
        toast.success("Vehicle Released Successfully");
        navigate("/Vehicles");
      }
    } catch (error) {
      console.error(error.response);
      toast.error(error.response?.data?.message || "Failed to release vehicle");
    } finally {
      setLoading(false);
    }
  };

  const isInsuranceExpired =
    data?.insuranceExpiry && new Date(data.insuranceExpiry) < new Date();
  const isInspectionExpired =
    data?.inspectionExpiry && new Date(data.inspectionExpiry) < new Date();
  const isAdditionalExpired =
    Array.isArray(data?.additionalExpiry) &&
    data.additionalExpiry[0] &&
    new Date(data.additionalExpiry[0]) < new Date();

  const serviceItems = [
    {
      title: "Insurance",
      subtitle: data?.insuranceExpiry ? `(${data.insuranceExpiry})` : "",
      expired: isInsuranceExpired ? "Expired" : "",
      showSwitch: true,
      switchChecked: localSwitchStates.insuranceStatus === 1,
      onToggle: () => handleSwitchToggle('insurance'),
    },
    {
      title: "Inspection Documents",
      subtitle: data?.inspectionExpiry ? `(${data.inspectionExpiry})` : "",
      expired: isInspectionExpired ? "Expired" : "",
      showSwitch: true,
      switchChecked: localSwitchStates.inspectionStatus === 1,
      onToggle: () => handleSwitchToggle('inspection'),
    },
    {
      title: "Additional Documents",
      subtitle: Array.isArray(data?.additionalExpiry) && data.additionalExpiry[0]
        ? `(${data.additionalExpiry[0]})`
        : "",
      expired: isAdditionalExpired ? "Expired" : "",
      showSwitch: true,
      switchChecked: localSwitchStates.additionalStatus === 1,
      onToggle: () => handleSwitchToggle('additional'),
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
    },
  ];

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
          className={`w-full rounded-xl p-4 2xl:p-5 ${theme === "dark"
            ? "bg-[#323335]"
            : "bg-white border border-[#ececec]"
            } shadow-md flex items-center justify-between ${
            item.func || item.route ? 'cursor-pointer' : ''
          }`}
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
              className={`${theme === "dark" ? "text-white" : "text-black"
                } text-[1.4rem] font-medium`}
            >
              {item.title}
            </p>
            {item.subtitle && (
              <p className="text-[#2D9BFF] text-[0.8rem] font-medium">
                {item.subtitle}{" "}
                <span className="text-red-500">{item.expired}</span>
              </p>
            )}
          </div>
          {item.showSwitch && (
            <div onClick={(e) => e.stopPropagation()}>
              <InsuranceSwitch
                checked={item.switchChecked}
                disabled={false}
                onChange={(e) => {
                  e.stopPropagation();
                  item.onToggle();
                }}
              />
            </div>
          )}
          {item.showArrow && (
            <IoIosArrowForward
              className={`text-[1.4rem] ${theme === "dark" ? "text-white" : "text-black"
                }`}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Services;