import { useEffect, useState } from "react";
import { FaChevronUp, FaChevronDown, FaSearch } from "react-icons/fa";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const CountryCode = ({setCountryCode}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
          .filter((country) => country.code)
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        setCountryCodes(formattedData);
        setFilteredCountries(formattedData);

        if (formattedData.length > 0) {
          setSelectedCountry({
            flag: formattedData[0].flag,
            code: formattedData[0].code,
          });
          setCountryCode(formattedData[0].code)
        }
      }
    } catch (error) {
      console.error("Error fetching country codes:", error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredCountries(countryCodes);
    } else {
      const filtered = countryCodes.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase()) ||
        country.code.includes(query)
      );
      setFilteredCountries(filtered);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry({ flag: country.flag, code: country.code });
    setCountryCode(country.code);
    setIsOpen(false);
    setSearchQuery("");
    setFilteredCountries(countryCodes);
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchQuery("");
      setFilteredCountries(countryCodes);
    }
  };

  useEffect(() => {
    getCodes();
  }, []);

  return (
    <div className="relative w-full">
      <motion.div
        onClick={handleDropdownToggle}
        className={`w-full py-3 px-4 flex justify-between items-center font-medium rounded-xl cursor-pointer focus:outline-none ${
          theme === "dark"
            ? "bg-[#323335] text-white"
            : "bg-[#f7f7f7] text-black border border-[#e8e8e8]"
        } `}
      >
        <div className="flex items-center gap-2">
          {selectedCountry.flag && (
            <img src={selectedCountry.flag} alt="flag" className="w-5 h-5 rounded-full" />
          )}
          <span>{selectedCountry.code || "+1"}</span>
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`absolute w-full mt-2 rounded-md shadow-lg border border-gray-600 z-20 ${
              theme === "dark" ? "bg-[#323334] text-white" : "bg-white text-black"
            }`}
          >
            {/* Search Field */}
            <div className="p-3 border-b border-gray-300 dark:border-gray-600">
              <div className="relative">
                <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`} />
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "bg-[#2a2a2a] text-white placeholder-gray-400 border border-gray-600"
                      : "bg-gray-50 text-black placeholder-gray-500 border border-gray-300"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Country List */}
            <div className="max-h-[15vh] overflow-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <motion.div
                    key={index}
                    whileHover={{
                      backgroundColor: theme === "dark" ? "#444" : "#f0f0f0",
                    }}
                    className="px-4 py-3 flex items-center gap-3 cursor-pointer"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <img src={country.flag} alt="flag" className="w-5 h-5 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{country.code}</span>
                      <span className="text-xs opacity-70">{country.name}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  No countries found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountryCode;