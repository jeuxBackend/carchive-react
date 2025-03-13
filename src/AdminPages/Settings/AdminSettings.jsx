import { useTheme } from "../../Contexts/ThemeContext";
import { motion } from "framer-motion";
import about from "./assets/aboutus.png";
import privacy from "./assets/privacy.png";
import mode from "./assets/light.png";
import aboutDark from "./assets/aboutDark.png";
import privacyDark from "./assets/privacyDark.png";
import modeDark from "./assets/lightDark.png";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
     
      
      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { to: "/Admin/About", icon: about, iconDark: aboutDark, label: "About Us" },
          { to: "/Admin/Privacy-Policy", icon: privacy, iconDark: privacyDark, label: "Privacy Policy",  iconSize: "w-[1.7rem]" }].map((item, index) => (
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
            <p className={`lg:text-[1.3rem] xl:text-[1.1rem] 2xl:text-[1.5rem]  ${theme === "dark" ? "text-white" : "text-black"}`}>Light Mode</p>
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

export default AdminSettings;
