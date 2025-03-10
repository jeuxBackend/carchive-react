import React, { useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import searchDark from "../../assets/search-dark.png";
import searchLight from "../../assets/search-light.png";
import { motion } from "framer-motion";

function Search() {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{ scale: isFocused ? 1.01 : 1 }}
      transition={{ duration: 0.2 }}
      className={`relative w-full rounded-xl p-[1px] shadow-md ${
        theme === "dark"
          ? "bg-gradient-to-r from-[#434649] to-[#3172ad]"
          : "bg-[#ececec]"
      }`}
    >
      <div
        className={`w-full py-3 px-4 flex justify-between items-center gap-3 rounded-xl focus:outline-none ${
          theme === "dark" ? "bg-[#323334] text-white" : "bg-white text-black"
        }`}
      >
        <motion.img
          src={theme === "dark" ? searchDark : searchLight}
          className="w-[1.5rem] cursor-pointer"
          whileTap={{ scale: 0.9 }}
        />
        <input
          type="text"
          className={`w-full border-none outline-none ${
            theme === "dark" ? "placeholder:text-white" : "placeholder:text-black"
          }`}
          placeholder="Search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </motion.div>
  );
}

export default Search;
