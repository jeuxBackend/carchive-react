import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import { FaCarCrash } from "react-icons/fa";

const NoDataFound = () => {
  const {theme} = useTheme()
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center p-8  rounded-lg "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6 shadow-inner">
        <FaCarCrash className="text-[#2d9bff] text-6xl" />
      </div>
      <h2 className={`${theme==="dark"?"text-white":"text-gray-700"} text-2xl font-bold  mb-2`}>No Data Found</h2>
      <p className={`${theme==="dark"?"text-white/80":"text-gray-500"} text-sm mb-4`}>
        We couldn't find what you're looking for. Try adjusting your filters or adding some data.
      </p>
    
    </motion.div>
  );
};

export default NoDataFound;
