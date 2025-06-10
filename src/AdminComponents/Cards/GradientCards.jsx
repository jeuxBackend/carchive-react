import React, { useState, useEffect } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import hamLight from "../../assets/hamLight.png";
import ham from "../../assets/hamburger.png";
import { Link, useNavigate } from "react-router-dom";
import { activeBlock, bypassVerification } from "../../API/adminServices";
import { toast, ToastContainer } from "react-toastify";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { BeatLoader } from "react-spinners";

function GradientCards({
  img,
  title,
  contact,
  id,
  status,
  fetchAdminCompanyData,

}) {
  const { theme } = useTheme();
  const { companyId, setCompanyId } = useGlobalContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bypassLoading, setBypassLoading] = useState({});
  const navigate = useNavigate();

  const handleStatus = async () => {
    console.log("company id:", id);
    setLoading(true);
    try {
      const response = await activeBlock(id);
      if (response) {
        toast.success("User Status Changed Successfully");
        console.log(response);
        fetchAdminCompanyData();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleBypassVerification = async (id) => {
    setBypassLoading(prev => ({ ...prev, [id]: true }));
    try {
      const response = await bypassVerification({ id: id });
      console.log("Bypass verification response:", response);
      // Refresh the data after successful bypass
      await fetchAdminCompanyData();
      toast.success("Verification bypassed successfully!");
    } catch (error) {
      console.error("Error bypassing verification:", error);
    } finally {
      setBypassLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
      <motion.div
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`${theme === "dark"
          ? "border border-[#323335] bg-[#323335] rounded-xl shadow-sm"
          : "border-2 border-[#ECECEC] rounded-xl shadow-sm"
          }`}
        onClick={() => {
          setCompanyId(id);
          navigate(`/Admin/Company/${id}`);
        }}
      >
        <div
          className="m-3 h-64 bg-cover bg-center relative rounded-xl"
          style={{ backgroundImage: `url(${img})` }}
        >
          <motion.img
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}

            src={theme === "dark" ? ham : hamLight}
            alt="menu"
            className={`${theme === "light" && "bg-white rounded-full"
              } absolute top-2 right-2 z-30 w-[1.7rem] cursor-pointer`}
            whileTap={{ scale: 0.8 }}
          />

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                className="bg-white w-[120 p-3 px-4 absolute z-40 top-6 right-6 flex flex-col items-center gap-2 rounded-l-md rounded-br-md rounded-tr-md text-[#7587a9] shadow-lg"
              >
                <p
                  className={`${status === "0" ? "text-red-500" : "text-green-500"
                    } font-medium cursor-pointer`}
                  onClick={() => handleStatus(id)}
                >
                  {loading
                    ? "Processing..."
                    : status === "0"
                      ? "Deactivate"
                      : "Activate"}
                </p>
                <button
                  onClick={() => handleBypassVerification(id)}
                  disabled={bypassLoading[id]}
                  className={`px-4 mt-2 w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${bypassLoading[id]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#479cff] text-white"
                    }`}
                >
                  {bypassLoading[id] ? (
                    <div className="flex items-center justify-center">
                      <BeatLoader color="#ffffff" size={8} />
                    </div>
                  ) : (
                    "Bypass Verification"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="bg-gradient-to-t from-black/80 via-transparent to-black/80 absolute h-full w-full top-0 rounded-xl"
          />

          <motion.div
            className="text-white absolute bottom-0 m-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Link
              onClick={function () {
                setCompanyId(id);
              }}
              to={`/Admin/Company/${id}`}
            >
              <p className="text-[#898C8E]">
                Company Name: <span className="text-[#FFFFFF]">{title}</span>
              </p>
              <p className="text-[#898C8E]">
                Contact Info: <span className="text-[#FFFFFF]">{contact}</span>
              </p>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

export default GradientCards;
