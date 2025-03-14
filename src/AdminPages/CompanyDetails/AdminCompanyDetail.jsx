import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import car1 from "./assets/car1.png";
import car2 from "./assets/car2.png";
import car3 from "./assets/car3.png";
import car4 from "./assets/car4.png";
import car5 from "./assets/car5.png";
import car6 from "./assets/car6.png";
import d1 from "./assets/d1.png";
import d2 from "./assets/d2.png";
import d3 from "./assets/d3.png";
import { useTheme } from "../../Contexts/ThemeContext";
import AdminDriverCards from "./AdminDriverCard";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { getAdminCompanyDetail } from "../../API/adminServices";
import { BeatLoader } from "react-spinners";

function AdminCompanyDetail() {
  const { theme } = useTheme();
  const { companyId } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [companyDetailData, setCompanyDetailData] = useState({});

  const fetchAdminCompanyDetailData = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await getAdminCompanyDetail(id);
      if(response){
        console.log(response.data)
      }
      setCompanyDetailData(response?.data?.data || {});
    } catch (error) {
      console.log("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAdminCompanyDetailData(companyId);
  }, [fetchAdminCompanyDetailData, companyId]);

  console.log("my company detail id:", companyId);

  const userDetails = {
    email: companyDetailData?.email || "Email Not Found",
    phone: companyDetailData?.phNumber || "Phone# Not Found",
    vat: companyDetailData?.vatNum || "Vat# Not Found",
    address: companyDetailData?.company?.street + " , " + companyDetailData?.company?.city + " , " + companyDetailData?.company?.country  || "Address Not Found",
  };

  const cars = companyDetailData?.cars?.map((car) => ({
    id: car.id,
    image: Array.isArray(car.image) && car.image.length > 0 ? car.image[0] : null,
  })) || [];

  const drivers =
    companyDetailData?.drivers?.map((driver) => ({
      id: driver.driverId,
      name: driver.name,
      image: driver.image,
    })) || [];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <BeatLoader color="#009eff" loading={loading} mt-4 size={15} />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`w-[100%] ${
            theme === "dark" ? "text-white" : "text-black "
          }`}
        >
          <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className={`p-2 sm:p-6 rounded-lg ${
                theme === "dark"
                  ? "bg-[#323335] border-2 border-[#323335]"
                  : "bg-[#FFFFFF] border-2 border-[#ECECEC]"
              }`}
            >
              <h2 className="text-xl mb-4">Details</h2>
              <div className="space-y-3">
                {Object.entries(userDetails).map(([key, value], index) => (
                  <motion.p
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 flex gap-1 flex-col md:flex-row rounded-xl transition-all duration-200 ${
                      theme === "dark" ? "bg-[#1B1C1E]" : "bg-[#F7F7F7]"
                    }`}
                  >
                    <span
                      className={`${
                        theme === "dark" ? "text-[#767778]" : "text-black"
                      }`}
                    >
                      {key.replace(/^\w/, (c) => c.toUpperCase())}:
                    </span>
                    <strong
                      className={`sm:text-[1rem] text-[0.8rem] ${
                        theme === "dark" ? "text-[#F7F7F7]" : "text-black"
                      }`}
                    >
                      {value}
                    </strong>
                  </motion.p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              className={`p-2 sm:p-6 rounded-lg ${
                theme === "dark"
                  ? "bg-[#323335] border-2 border-[#323335]"
                  : "bg-[#FFFFFF] border-2 border-[#ECECEC]"
              }`}
            >
              <h2 className="text-xl mb-4">Company Vehicles</h2>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
                }}
                className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4"
              >
                {cars.length > 0 ? (
                  cars.map((car) => (
                    <motion.div
                      key={car.id}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                      whileHover={{
                        scale: 1.1,
                        rotate: 2,
                        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`w-full flex justify-center rounded-xl transition-all duration-300 ${
                        theme === "dark" ? "bg-[#1B1C1E]" : "bg-[#F7F7F7]"
                      }`}
                    >
                      <img
                        src={car.image}
                        alt={`car`}
                        className="w-32 h-32 object-contain rounded-lg"
                      />
                    </motion.div>
                  ))
                ) : (
                  <p className="">No vehicles available</p>
                )}
              </motion.div>
            </motion.div>
          </div>
          <div className="w-[100%] ">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className={`p-2 sm:p-6 w-full rounded-lg mt-4 ${
                theme === "dark"
                  ? "bg-[#323335] border-2 border-[#323335]"
                  : "bg-[#FFFFFF] border-2 border-[#ECECEC]"
              }`}
            >
              <h2 className="text-xl mb-4">Company Drivers</h2>
              <div className="grid w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {drivers.length > 0 ? (
                  drivers.map((driver) => (
                    <AdminDriverCards
                      key={driver.id}
                      img={driver.image}
                      name={driver.name}
                    />
                  ))
                ) : (
                  <p>No drivers available</p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
}

export default AdminCompanyDetail;
