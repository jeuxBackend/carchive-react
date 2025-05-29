import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Import icons
import Language from "../Language/Language";
import { Dropdown } from "@mui/base";

function CustomDropdown({ label, value, setValue, fieldKey }) {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (selectedValue) => {
        setValue((prev) => ({ ...prev, [fieldKey]: selectedValue }));
        setIsOpen(false);
    };

    const options = [
        { label: "Maintenance", value: "Maintenance" },
        { label: "Brakes", value: "Brakes" },
        { label: "Tyres", value: "Tyres" },
        { label: "Engine", value: "Engine" },
        { label: "Transmission", value: "Transmission" },
        { label: "Exhaust", value: "Exhaust" },
        { label: "Suspension and Steering", value: "Suspension and Steering" },
        { label: "Electrical Repair", value: "Electrical Repair" },
        { label: "Airco", value: "Airco" },
        { label: "Bodywork", value: "Bodywork" },
        { label: "Glass", value: "Glass" },
        { label: "Performance Upgrades", value: "Performance Upgrades" },
        { label: "Vehicle Check", value: "Vehicle Check" },
        { label: "Diagnose", value: "Diagnose" },
        { label: "Detailing", value: "Detailing" },
        { label: "Other", value: "Other" },
    ];

    return (
        <div className="relative w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-4 rounded-xl font-medium cursor-pointer flex items-center justify-between 
                    ${theme === "dark" ? "bg-[#1b1c1e] text-white" : "bg-[#f7f7f7] border border-[#e8e8e8] text-black"}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value[fieldKey] || label}</span>
                {isOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </motion.div>

            {isOpen && (
                <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute left-0 top-full mt-2 w-full shadow-lg rounded-lg z-10 
                        ${theme === "dark" ? "bg-[#1b1c1e] text-white" : "bg-white text-black"}
                        max-h-52 overflow-y-auto`}
                >
                    {options.map((option, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(option.value)}
                            className={`p-3 cursor-pointer transition 
                                ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                        >
                            {option.label}
                        </li>
                    ))}
                </motion.ul>
            )}
        </div>
    );
}

export default CustomDropdown;
