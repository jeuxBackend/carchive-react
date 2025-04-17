import React from "react";
import { useTheme } from "../../../Contexts/ThemeContext";
import Switch from "../../../Components/Buttons/Switch";
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { releaseVehicle } from "../../../API/portalServices";
import { toast } from "react-toastify";
import InsuranceSwitch from "../../../Components/Buttons/InsuranceSwitch";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Services({ data, setLoading }) {
  const { theme } = useTheme();
  const navigate = useNavigate();

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

  const insuranceSwitchState = !isInsuranceExpired;

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {[
        {
          title: "Insurance",
          subtitle: data?.insuranceExpiry ? `(${data.insuranceExpiry})` : "",
          expired: isInsuranceExpired ? "Expired" : "",
          showSwitch: true,
          switchChecked: insuranceSwitchState,
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
      ].map((item, index) => (
        <motion.div
          key={index}
          className={`w-full rounded-xl p-4 2xl:p-5 ${
            theme === "dark"
              ? "bg-[#323335]"
              : "bg-white border border-[#ececec]"
          } shadow-md flex items-center justify-between cursor-pointer`}
          variants={itemVariants}
          onClick={() => {
            if (item.func) {
              item.func();
            } else if (item.route) {
              navigate(item.route);
            }
          }}
        >
          <div className="flex items-center gap-2">
            <p
              className={`${
                theme === "dark" ? "text-white" : "text-black"
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
            <InsuranceSwitch checked={item.switchChecked} disabled />
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
