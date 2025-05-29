import React from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useTheme } from "../../../Contexts/ThemeContext";
import { useTranslation } from "react-i18next";

const ViewDetailsModal = ({ setOpen, userData }) => {
  const { t } = useTranslation();
  const { theme } = useTheme(); // use context directly

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50"
      onClick={() => setOpen(false)}
    >
      <motion.div
        className={`relative w-[90%] max-w-2xl p-6 rounded-xl shadow-xl ${theme === "dark" ? "bg-[#1f1f1f] text-white" : "bg-white text-black"
          }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-xl cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <IoClose />
        </button>

        <h2 className="text-2xl text-[#489BF9] font-semibold mb-4 text-center">
          {t("Buyer Details")}
        </h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <p className="text-lg font-semibold">{t("Name")}:</p>
            <p className="text-gray-500 text-lg">{userData?.buyer?.name}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-semibold">{t("Email")}:</p>
            <p className="text-gray-500 text-lg">{userData?.buyer?.email}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-semibold">{t("Phone")}:</p>
            <p className="text-gray-500 text-lg">{userData?.buyer?.phNumber}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-lg font-semibold">{t("VIN Number")}:</p>
            <p className="text-gray-500 text-lg">{userData?.car?.vinNumber}</p>
          </div>

          <div>
            <p className="text-lg font-semibold">{t("Message")}:</p>
            <p className="text-gray-500 text-lg">{userData?.request?.message}</p>
          </div>

          <div>
            <p className="text-lg font-semibold">{t("Document")}:</p>
            <img
              src={userData?.request?.document}
              alt={t("Document")}
              className="w-full h-[300px] rounded-lg border border-gray-200 mt-2 object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewDetailsModal;
