import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import CustomDropdown from "../../AdminComponents/DropDown/CustomDropdown";
import CustomDatePicker from "../../AdminComponents/DropDown/BasicDatePicker";
import ImageUploader from "../../AdminComponents/ImageUploader/ImageUploader";
import { addAdminInvoice } from "../../API/apiService";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { toast } from "react-toastify";

function AddInvoice({ open, setOpen, refreshInvoices }) {
  if (!open) return null;
  const { theme } = useTheme();
  const { companyId } = useGlobalContext();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [image, setImage] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleAddInvoice = useCallback(async () => {
    if (!status) toast.error("Status is required!");
    if (!startDate) toast.error("Start Date is required!");
    if (!endDate) toast.error("End Date is required!");
    if (!image) toast.error("Image is required!");
    if (!status || !startDate || !endDate || !image) {
      console.warn("Form validation failed:", { status, startDate, endDate, image });
      return;
  
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("userId", companyId);
    formData.append("status", status);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("image", image);

    try {
      const response = await addAdminInvoice(formData);
      if (response?.data) {
        toast.success("Invoice added successfully!");
        setOpen(false);
        refreshInvoices();
      } else {
        console.log("response",response.error)
        toast.error("Failed to add invoice!");
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
      toast.error("Something went wrong! Try again.");
    } finally {
      setLoading(false);
    }
  }, [status, startDate, endDate, image, companyId, setOpen, refreshInvoices]);

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
              Add Vehicle
            </p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <CustomDropdown
              label="Select Status"
              option={[
                { label: "Paid", value: "1" },
                { label: "Unpaid", value: "0" },
              ]}
              onChange={(value) => setStatus(value)}
            />
            <CustomDatePicker
              label="Start Date"
              onChange={(date) => setStartDate(date)}
            />
            <CustomDatePicker
              label="End Date"
              onChange={(date) => setEndDate(date)}
            />
            <ImageUploader onUpload={(file) => setImage(file)} />
          </div>
          <div className="flex items-center justify-center w-full  mt-4">
            <div
              onClick={handleAddInvoice}
              className="bg-[#2d9bff] w-[60%] cursor-pointer text-center py-2 text-white rounded-xl"
            >
               {loading ? (
          <div className="flex items-center gap-2 justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            Adding...
          </div>
        ) : (
          "Add Invoice"
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

export default AddInvoice;
