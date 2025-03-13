import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { IoChevronDown } from "react-icons/io5";

function CustomDropdown({ label, option=[], onChange }) {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(label);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const selectOption = (selectedOption) => {
        setSelected(selectedOption.label);
        setIsOpen(false);
        onChange && onChange(selectedOption.value);
    };

    return (
        <div className="relative w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex items-center justify-between gap-2 w-full p-3 py-4 rounded-xl font-medium cursor-pointer ${theme === "dark" ? "bg-[#323335] text-white" : "bg-[#f7f7f7] border border-[#e8e8e8] text-black"}`}
                onClick={toggleDropdown}
            >
                {selected}
                <IoChevronDown className="text-lg" />
            </motion.div>
            {isOpen && (
                <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute left-0 mt-2 w-full rounded-xl shadow-lg z-10 ${theme === "dark" ? "bg-[#323335] text-white" : "bg-white border border-[#e8e8e8] text-black"}`}
                >
                     {option.map((opt, index) => (
                        <li
                            key={index}
                            className="p-3  cursor-pointer rounded-lg"
                            onClick={() => selectOption(opt)}
                        >
                            {opt.label}
                        </li>
                   ))}
                </motion.ul>
            )}
        </div>
    );
}

export default CustomDropdown;
