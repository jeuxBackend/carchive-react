import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import AddAbout from "./AddAbout";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { getSettings } from "../../API/adminServices";
import { BeatLoader } from "react-spinners";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";
const AdminAbout = () => {
    const { theme } = useTheme();
    const {addAbout, setAddAbout}=useGlobalContext()
    const [settingData, setSettingData] = useState("");
    const [loading, setLoading] = useState(false);

    
    const fetchSettingData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getSettings();
            if (response?.data?.data?.length) {
                setSettingData(response.data.data[0].aboutUs || "No About Us Found");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettingData();
    }, [fetchSettingData]);
    return (
        <>
        <AddAbout fetchSettingData={fetchSettingData} open={addAbout} setOpen={setAddAbout} label={"About Us"}/>
        <div className={` ${theme === "dark" ? "bg-[#1B1C1E] text-[#8D8D8E]" : "bg-[#FFFFFF] text-[#4D4E50]"}`}>
        {loading ? (
            <div className="flex justify-center items-center h-[80vh]">
              <BeatLoader color="#009eff" loading={loading} mt-4 size={15} />
            </div>
          ) : (settingData?.length > 0?
            <div className="">

                <motion.p
                    className="text-lg leading-relaxed text-justify"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {settingData}
                </motion.p>


            </div>:<div className="h-[80vh] flex items-center justify-center"><NoDataFound/></div>
          )}
        </div>
        </>
    );
};

export default AdminAbout;
