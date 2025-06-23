import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import backgroundpic from "./assets/bg.png";
import GradientButton from "../../Components/Buttons/GradientButton";
import RequestButton from "../../Components/Buttons/RequestButton";
import g1 from "./assets/g1.png";
import GarageCard from "./GarageCard";
import { changeRequestStatus, getRequests } from "../../API/portalServices";
import { BeatLoader } from "react-spinners";
import NoDataFound from "../../GlobalComponents/NoDataFound/NoDataFound";
import { toast } from "react-toastify";
import ViewDetailsModal from "./Modals/ViewDetailsModal";
import { useTranslation } from "react-i18next";


const Requests = () => {
  const { t } = useTranslation();

  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [requestsData, setRequestsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchRequestsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getRequests();
      setRequestsData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequestsData();
  }, []);

  const requestStatus = async (id, status) => {
    setLoading(true);
    try {
      const response = await changeRequestStatus({ id, status });
      if (response.data) {
        toast.success("Status Changed Successfully");
        fetchRequestsData();
      }
    } catch (error) {
      console.error(error.response);
      toast.error(error.response?.data?.message || "Error changing status");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (buyer) => {
    setSelectedUser(buyer);
    setIsModalOpen(true);
  };

  return (
    <>
      {loading ? (
        <div className="h-[80vh] flex items-center justify-center">
          <BeatLoader color="#2d9bff" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {requestsData?.customerRequests?.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
            >
              {requestsData?.customerRequests?.map((request, index) => (
                <motion.div
                  key={index}
                  className={`relative p-6 rounded-lg shadow-lg overflow-hidden transition-all 
                    ${
                      theme === "dark"
                        ? "bg-[#323335] border-2 border-[#323335]"
                        : "bg-white border-2 border-[#ECECEC]"
                    }`}
                  style={{
                    backgroundImage: `url(${backgroundpic})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right bottom",
                    backgroundSize: "130px auto",
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between sm:flex-row flex-col">
                      <div>
                        <p className="text-[#8D8D8F] text-sm">{t("Driver Name")}</p>
                        <p
                          className={`${
                            theme === "dark" ? "text-white" : "text-black"
                          } font-semibold`}
                        >
                          {request?.buyer?.name} {request?.buyer?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#8D8D8F] text-sm">{t("Number Plate")}</p>
                        <p
                          className={`${
                            theme === "dark" ? "text-white" : "text-black"
                          } font-semibold`}
                        >
                          {request?.car?.numberPlate}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between sm:flex-row flex-col">
                      <div className="mt-4">
                        <p className="text-[#8D8D8F] text-sm">{t("Vin Number")}</p>
                        <p
                          className={`${
                            theme === "dark" ? "text-white" : "text-black"
                          } font-semibold`}
                        >
                          {request?.car?.vinNumber}
                        </p>
                      </div>

                      <div className="mt-8">
                        <a
                          href="#"
                          className="text-[#319BFB] font-medium hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewDetails(request);
                          }}
                        >
                          {t("View Details")}
                        </a>
                      </div>
                    </div>
                      <div className="mt-3">
                        <p
                          
                          className="text-[#319BFB] font-medium hover:underline"
                          
                        >
                          {t("Buying Request")}
                        </p>
                      </div>
                   

                    <div className="mt-4 flex gap-4 sm:flex-row flex-col">
                      <GradientButton
                       name={t("Reject")}
                        handleClick={() =>
                          requestStatus(request?.request?.id, "2")
                        }
                        loading={loading}
                      />
                      <RequestButton
                        name={t("Accept")}
                        handleClick={() =>
                          requestStatus(request?.request?.id, "1")
                        }
                        loading={loading}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="h-[40vh] flex items-center justify-center">
              <NoDataFound />
            </div>
          )}

          {/* Garage Requests */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } font-medium text-[1.3rem] sm:text-[2rem] my-4`}
            >
              {t("Garage Requests")}
            </p>
            {requestsData?.grages?.length > 0 ? (
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 },
                  },
                }}
              >
                {requestsData?.grages?.map((data, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <GarageCard
                      data={data}
                      fetchRequestsData={fetchRequestsData}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="h-[40vh] flex items-center justify-center">
                <NoDataFound />
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <ViewDetailsModal
          theme={theme}
          setOpen={setIsModalOpen}
          userData={selectedUser}
        />
      )}
    </>
  );
};

export default Requests;
