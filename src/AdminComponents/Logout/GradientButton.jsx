import React, { useState } from "react";

import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import { activeBlock } from "../../API/apiService";
import { toast } from "react-toastify";

function GradientButton({ name, driverId, driverData }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleStatus = async () => {
    console.log("driver id:", driverId);
    setLoading(true);
    try {
      const response = await activeBlock(driverId);
      if (response) {
        toast.success("User Status Changed Successfully");
        console.log(response);
        driverData();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      onClick={!loading ? handleStatus : null}
      className={`relative w-full rounded-xl p-[1px] text-center flex items-center justify-center shadow-md cursor-pointer ${
        theme === "dark"
          ? "bg-gradient-to-r from-[#434649] to-[#3172ad]"
          : "bg-[#ececec]"
      }`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 px-3 xl:text-[1rem] lg:text-[0.6rem] text- 2xl:px-4 flex justify-center items-center rounded-xl focus:outline-none ${
          theme === "dark"
            ? "bg-[#323334] text-white"
            : "bg-[#323335] text-white"
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            Processing...
          </div>
        ) : (
          name
        )}
      </motion.div>
    </div>
  );
}

export default GradientButton;
