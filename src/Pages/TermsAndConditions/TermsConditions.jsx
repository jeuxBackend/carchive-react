import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import { getSettings } from "../../API/portalServices";
import { BeatLoader } from "react-spinners";

const TermsConditions = () => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [settingData, setSettingData] = useState({})

    const fetchSettingData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getSettings();
            if(response){
             setSettingData(response?.data?.data[0] || {});
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettingData();
    }, []);

    return (
        <div className={` ${theme === "dark" ? "bg-[#1B1C1E] text-[#8D8D8E]" : "bg-[#FFFFFF] text-[#4D4E50]"}`}>
            {loading ? <div className="h-[80vh] flex items-center justify-center">
                <BeatLoader color="#2d9bff" />
            </div> :
                <div className="">

                    <motion.p
                        className="text-lg leading-relaxed text-justify"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {settingData?.terms_and_conditions}
                    </motion.p>


                </div>}
        </div>
    );
};

export default TermsConditions;
