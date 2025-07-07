import React, { useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import english from "./assets/english.png";
import french from "./assets/french.png";
import netherlands from "./assets/netherland.png";
import Search from "../../Components/Search/Search";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { updateProfile } from "../../API/portalServices";

const Language = () => {
    const { theme } = useTheme();
    const { i18n } = useTranslation();
    const [searchValue, setSearchValue] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(null);
    const { t } = useTranslation();

    const changeLanguage = async (lang) => {
        setIsUpdating(true);
        setUpdateStatus(null);
        
        try {
            i18n.changeLanguage(lang);
            localStorage.setItem('language', lang);
            
            const response = await updateProfile({ lang });
            
            if (response.data) {
                setUpdateStatus({ type: 'success', message: 'Language updated successfully' });
            } else {
                setUpdateStatus({ type: 'error', message: response.message || 'Failed to update language' });
             
            }
        } catch (error) {
            console.error('Error updating language:', error);
            setUpdateStatus({ type: 'error', message: 'Network error. Please try again.' });
            
        } finally {
            setIsUpdating(false);
            setTimeout(() => setUpdateStatus(null), 3000);
        }
    };

    const currentLanguage = i18n.language;

    const languages = [
        { name: t("English"), flag: english, code: "ENG" },
        { name: t("French"), flag: french, code: "FR" },
        { name: t("Netherland"), flag: netherlands, code: "DU" }
    ];

    const filteredLanguages = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div>
            <div className="pb-4">
                <Search
                    value={searchValue}
                    setValue={setSearchValue}
                    placeholder="Search languages..."
                />
            </div>
            
        
            {updateStatus && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mb-4 p-3 rounded-lg ${
                        updateStatus.type === 'success'
                            ? theme === "dark"
                                ? "bg-green-800 text-green-100"
                                : "bg-green-100 text-green-800"
                            : theme === "dark"
                                ? "bg-red-800 text-red-100"
                                : "bg-red-100 text-red-800"
                    }`}
                >
                    {updateStatus.message}
                </motion.div>
            )}
            
            <div className="w-full">
                {filteredLanguages.map((lang, index) => {
                    const isSelected = currentLanguage === lang.code;
                    const isCurrentlyUpdating = isUpdating && isSelected;

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => !isUpdating && changeLanguage(lang.code)}
                            className={`flex items-center w-full space-x-3 p-4 rounded-lg cursor-pointer transition-all mb-2 ${
                                isUpdating ? 'opacity-70 cursor-not-allowed' : ''
                            } ${
                                isSelected
                                    ? theme === "dark"
                                        ? "bg-blue-600 border-2 border-blue-400"
                                        : "bg-blue-100 border-2 border-blue-500"
                                    : theme === "dark"
                                        ? "bg-[#323335] hover:bg-[#404042]"
                                        : "bg-[#F7F7F7] hover:bg-gray-200"
                            }`}
                        >
                            <img src={lang.flag} alt={`${lang.name} flag`} className="w-[2.5rem]" />
                            <span className={`text-lg font-medium ${
                                isSelected
                                    ? theme === "dark"
                                        ? "text-white font-semibold"
                                        : "text-blue-800 font-semibold"
                                    : theme === "dark"
                                        ? "text-white"
                                        : "text-black"
                            }`}>
                                {lang.name}
                            </span>
                            
                            <div className="ml-auto flex items-center space-x-2">
                                {isCurrentlyUpdating && (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                )}
                                {isSelected && !isCurrentlyUpdating && (
                                    <svg
                                        className={`w-6 h-6 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
                {filteredLanguages.length === 0 && searchValue && (
                    <div className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        No languages found matching "{searchValue}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default Language;