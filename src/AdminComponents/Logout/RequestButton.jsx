import React from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
function RequestButton({ name }) {
  const { theme } = useTheme();
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-3 px-3 xl:text-[1rem] lg:text-[0.6rem] text-center 2xl:px-4 flex justify-center items-center rounded-xl focus:outline-none ${
        theme === "dark"
          ? "bg-[#479cff] text-white"
          : "bg-[#479cff] text-white "
      }`}
    >
      {name}
    </motion.button>
  );
}

export default RequestButton;
