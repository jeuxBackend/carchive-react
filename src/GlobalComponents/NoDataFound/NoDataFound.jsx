import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import { FaCarCrash } from "react-icons/fa";
import { useTranslation } from 'react-i18next';


const NoDataFound = ({data=false}) => {
  const { t } = useTranslation();
  const { theme } = useTheme()
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center sm:p-8  rounded-lg "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full mb-6 shadow-inner">
        <FaCarCrash className="text-[#2d9bff] text-4xl sm:text-6xl" />
      </div>
      <h2 className={`${theme === "dark" ? "text-white" : "text-gray-700"} text-xl sm:text-2xl font-bold  mb-2`}>{data?t('no_vehicle_title'):t('no_data_found')}</h2>
      <p className={`${theme === "dark" ? "text-white/80" : "text-gray-500"} text-sm mb-4`}>
        {data?t('no_vehicle_found'): t('no_data_description')}
      </p>

    </motion.div>
  );
};

export default NoDataFound;
