import { useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const CountryCode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    flag: "",
    code: "",
  });
  const { theme } = useTheme();

  const getCodes = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      if (response.data) {
        const formattedData = response.data
          .map((country) => ({
            name: country.name.common,
            flag: country.flags?.png || "",
            code: country.idd?.root
              ? `${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ""}`
              : "",
          }))
          .filter((country) => country.code);

        setCountryCodes(formattedData);

        
        if (formattedData.length > 0) {
          setSelectedCountry({
            flag: formattedData[0].flag,
            code: formattedData[0].code,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching country codes:", error);
    }
  };

  useEffect(() => {
    getCodes();
  }, []);

  return (
    <div className="relative w-full">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-3 px-4 flex justify-between items-center font-medium rounded-xl focus:outline-none ${
          theme === "dark"
            ? "bg-[#323335] text-white"
            : "bg-[#f7f7f7] text-black border border-[#e8e8e8]"
        } `}
      >
        <div className="flex items-center gap-2">
          {selectedCountry.flag && (
            <img src={selectedCountry.flag} alt="flag" className="w-5 h-5 rounded-full" />
          )}
          <span>{selectedCountry.code || "Select Country Code"}</span>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`absolute w-full mt-2 rounded-md shadow-lg border border-gray-600 z-20 h-[20vh] overflow-auto ${
              theme === "dark" ? "bg-[#323334] text-white" : "bg-white text-black"
            }`}
          >
            {countryCodes.map((country, index) => (
              <motion.div
                key={index}
                whileHover={{
                  backgroundColor: theme === "dark" ? "#444" : "#f0f0f0",
                }}
                className="px-4 py-3 flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  setSelectedCountry({ flag: country.flag, code: country.code });
                  setIsOpen(false);
                }}
              >
                <img src={country.flag} alt="flag" className="w-5 h-5 rounded-full" />
                <span>{country.code}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountryCode;
