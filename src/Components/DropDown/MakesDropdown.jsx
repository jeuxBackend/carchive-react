import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { useTheme } from "../../Contexts/ThemeContext";

function MakesDropdown({ label, value, setValue, fieldKey, options = [] }) {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const handleSelect = (option) => {
        setValue((prev) => ({ ...prev, [fieldKey]: option }));
        setIsOpen(false);
    };

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

    const filteredOptions = options.filter(option =>
        option?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isDarkMode = theme === "dark";

    return (
        <div ref={dropdownRef} className="relative w-full">
            
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex justify-between items-center w-full p-4 rounded-xl cursor-pointer font-medium 
                    ${isDarkMode ? "bg-[#1b1c1e] text-white border border-[#3a3b3c]" : "bg-[#f7f7f7] text-black border border-[#e8e8e8]"}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{value[fieldKey] || label}</span>
                <IoChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </motion.div>

           
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute left-0 w-full mt-2 rounded-xl shadow-lg z-10 border 
                        ${isDarkMode ? "bg-[#1b1c1e] text-white border-[#3a3b3c]" : "bg-white text-black border-gray-300"}`}
                >
         
                    <div className="p-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full p-2 rounded-md border outline-none bg-transparent 
                                ${isDarkMode ? "border-[#3a3b3c] text-white" : "border-gray-300 text-black"}`}
                        />
                    </div>

            
                    <ul className="max-h-[15rem] overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <li
                                    key={index}
                                    className={`p-3 cursor-pointer transition 
                                        ${isDarkMode ? "hover:bg-[#323335]" : "hover:bg-gray-200"}`}
                                    onClick={() => handleSelect(option?.name)}
                                >
                                    {option?.name}
                                </li>
                            ))
                        ) : (
                            <li className="p-3 text-center text-gray-500">No results found</li>
                        )}
                    </ul>
                </motion.div>
            )}
        </div>
    );
}

export default MakesDropdown;
