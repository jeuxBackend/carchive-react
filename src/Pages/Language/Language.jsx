import React from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import english from "./assets/english.png";
import french from "./assets/french.png";
import netherlands from "./assets/netherland.png";
import Search from "../../Components/Search/Search";
import { motion } from "framer-motion";

const languages = [
    { name: "English", flag: english },
    { name: "French", flag: french },
    { name: "Nederland's", flag: netherlands }
];

const Language = () => {
    const { theme } = useTheme();

    return (
        <div>
            <div className="pb-4">
                <Search />
            </div>
            <div className="w-full">
                {languages.map((lang, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-center w-full space-x-3 p-4 rounded-lg cursor-pointer transition-all mb-2
                            ${theme === "dark" ? "bg-[#323335]" : "bg-[#F7F7F7] hover:bg-gray-200"}`}
                    >
                        <img src={lang.flag} alt="" className="w-[2.5rem]" />
                        <span className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-medium`}>{lang.name}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Language;
