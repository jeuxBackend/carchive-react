import { useEffect, useRef, useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const Dropdown = ({ setValue }) => {
  const { t } = useTranslation();

  const options = [
    { name: t("all_vehicles"), value: "0" },
    { name: t("archived_vehicles"), value: "1" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]); // Default to "All Vehicles"
  const { theme } = useTheme();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setValue(options[0].value); // Set "All Vehicles" as default
  }, [setValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full rounded-xl p-[1px] shadow-md ${
        theme === "dark"
          ? "bg-gradient-to-r from-[#434649] to-[#3172ad]"
          : "bg-[#ececec]"
      }`}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-3 px-4 flex justify-between items-center rounded-xl focus:outline-none ${
          theme === "dark" ? "bg-[#323334] text-white" : "bg-white text-black"
        }`}
      >
        {selected.name}
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`absolute w-full mt-2 rounded-md shadow-lg border z-20 border-gray-600 ${
              theme === "dark" ? "bg-[#323334] text-white" : "bg-white text-black"
            }`}
          >
            {options.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ backgroundColor: theme === "dark" ? "#444" : "#f0f0f0" }}
                className="px-4 py-3 cursor-pointer"
                onClick={() => {
                  setSelected(item);
                  setValue(item.value);
                  setIsOpen(false);
                }}
              >
                {item.name}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
