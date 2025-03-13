import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import { updateSettings, getSettings } from "../../API/apiService";

function AddAbout({ open, setOpen, label, fetchSettingData }) {
  if (!open) return null;
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      const fetchPreviousText = async () => {
        try {
          const response = await getSettings();
          const aboutText = response?.data?.data?.[0]?.aboutUs || "";
          setText(aboutText);
        } catch (err) {
          console.error("Error fetching previous text:", err);
        }
      };
      fetchPreviousText();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Text cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await updateSettings({ key: "aboutUs", value: text });
      setOpen(false);
      fetchSettingData();
    } catch (err) {
      setError("Failed to update. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={`bg-black/50 backdrop-blur-lg overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full poppins`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center py-10 w-full min-h-screen ">
        <motion.div
          className={`rounded-xl w-[90%] p-6 sm:w-[40rem] shadow flex flex-col items-center justify-center gap-2
            ${
              theme === "dark"
                ? "bg-[#1b1c1e] border-2 border-[#323335]"
                : "bg-white border-2 border-[#ECECEC]"
            }`}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center w-full gap-2 justify-center relative">
            <img
              src={theme === "dark" ? back : backLight}
              alt=""
              className="w-[1.8rem] cursor-pointer absolute left-2"
              onClick={() => setOpen(false)}
            />
            <p
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium`}
            >
              Add {label}
            </p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              className={`flex items-center gap-2 w-full p-3 rounded-xl ${
                theme === "dark"
                  ? "bg-[#323335] text-white"
                  : "bg-[#f7f7f7] border border-[#e8e8e8] text-black"
              }`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="flex items-center justify-center w-full  mt-4">
            <div
              onClick={handleSubmit}
              className="bg-[#2d9bff] w-[60%] cursor-pointer text-center py-2 text-white rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Processing...
                </div>
              ) : (
                "Add About Us"
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// AddInvoice.propTypes = {
//   open: PropTypes.bool.isRequired,
//   setOpen: PropTypes.func.isRequired,
// };

export default AddAbout;
