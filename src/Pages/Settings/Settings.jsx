import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import img from "./assets/profile.png";
import lang from "./assets/lang.png";
import about from "./assets/aboutus.png";
import privacy from "./assets/privacy.png";
import mode from "./assets/light.png";
import notify from "./assets/notify.png";
import langDark from "./assets/langDark.png";
import aboutDark from "./assets/aboutDark.png";
import privacyDark from "./assets/privacyDark.png";
import modeDark from "./assets/lightDark.png";
import notifyDark from "./assets/notifyDark.png";
import { IoIosArrowForward } from "react-icons/io";
import Switch from "../../Components/Buttons/Switch";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getProfile } from "../../API/portalServices";
import avatar from "/avatar.png"
import { useTranslation } from 'react-i18next';


const Settings = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({})

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProfile();
      if (response) {
        setProfileData(response?.data || {});
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? <div className="h-[20vh] flex items-center justify-center">
        <motion.div
          className="w-7 h-7 border-2 border-[#479cff] border-t-transparent rounded-full mx-auto animate-spin"
        />
      </div> :
        <div className="flex items-center gap-5 sm:flex-row flex-col">
          <div className="flex items-center gap-3">
            <img
              src={profileData?.image || avatar}
              onError={(e) => {
                e.target.src = avatar;
              }}
              alt="profile"
              className="w-[4rem] sm:w-[9rem] border-2 border-[#479cff] rounded-xl h-[4rem] sm:h-[9rem] object-cover"
            />

            <div>
              <p className={`${theme === "dark" ? "text-white" : "text-black"} font-medium text-[1.2rem] sm:text-[1.6rem]`}>{profileData?.name} {profileData?.lastName}</p>
              <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[0.9rem]`}>{profileData?.email}</p>
            </div>
          </div>
          <Link to='/Update-Profile' className="bg-[#479cff] text-white py-2 px-5 rounded-lg">
          {t("Update Profile")}
          </Link>
        </div>}

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {[{ to: "/Language", icon: lang, iconDark: langDark, label: t("Language") },
        { to: "/About", icon: about, iconDark: aboutDark, label: t("About Us") },
        { to: "/TermsConditions", icon: about, iconDark: aboutDark, label: t("Terms & Conditions") },
        { to: "/Privacy-Policy", icon: privacy, iconDark: privacyDark, label: t("Privacy Policy"), iconSize: "w-[1.7rem]" }].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={item.to} className={`p-6 rounded-xl shadow-lg transition-all flex items-center justify-between ${theme === "dark" ? "bg-[#323335] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}>
              <div className="flex items-center gap-3">
                <img src={theme === "dark" ? item.icon : item.iconDark} alt="" className={item.iconSize || "w-[2.2rem]"} />
                <p className={`lg:text-[1.3rem] xl:text-[1.1rem] 2xl:text-[1.5rem]  ${theme === "dark" ? "text-white" : "text-black"}`}>{item.label}</p>
              </div>
              <IoIosArrowForward className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem]`} />
            </Link>
          </motion.div>
        ))}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className={`p-6 rounded-xl shadow-lg transition-all flex items-center justify-between ${theme === "dark" ? "bg-[#323335] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}
        >
          <div className="flex items-center gap-3">
            <img src={theme === "dark" ? mode : modeDark} alt="" className="w-[2.2rem]" />
            <p className={`lg:text-[1.3rem] xl:text-[1.1rem] 2xl:text-[1.5rem]  ${theme === "dark" ? "text-white" : "text-black"}`}>{t("Light Mode")}</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-blue-500"}`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${theme === "light" ? "translate-x-6 bg-white" : ""}`}
            ></span>
          </button>
        </motion.div>
        
      </div>
    </motion.div>
  );
};

export default Settings;
