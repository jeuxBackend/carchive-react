import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import DetailDiv from "./DetailDiv";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { getAdminGarageDetail } from "../../API/adminServices";

function GarageDetail({ open, setOpen, full }) {
  if (!open) return null;
  const { theme } = useTheme();
  const { selectedGarageId } = useGlobalContext();
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [garageDetailData, setGarageDetailData] = useState("");
  
    const fetchAdminGarageDetailData = useCallback(async (id) => {
      setLoading(true);
      try {
        const response = await getAdminGarageDetail(id);
        if(response){
          console.log(response.data)
        }
        setGarageDetailData(response?.data?.data || {});
      } catch (error) {
        console.log("Error while fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, []);
    useEffect(() => {
        fetchAdminGarageDetailData(selectedGarageId);
    }, [fetchAdminGarageDetailData, selectedGarageId]);

  const logoutHandle = () => {
    navigate("/");
    setLogout(false);
  };

  console.log("slected driver id:", selectedGarageId);

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
              Garage Details
            </p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <DetailDiv label="Garage Name" value={garageDetailData?.name || "Name Not Found"} />
            <DetailDiv label="Email" value={garageDetailData?.email || "Email Not Found"} />
            <DetailDiv label="Phone Number" value={garageDetailData?.phNumber || "Phone Not Found"} />
            {full && <DetailDiv label="VAT Number" value={garageDetailData?.vatNum || "Vat Not Found"} />}
            {full && (
              <DetailDiv
                label="Address"
                value={garageDetailData?.address || "Address Not Found"}
              />
            )}
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

export default GarageDetail;
