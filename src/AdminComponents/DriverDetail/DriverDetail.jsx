import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import DetailDiv from "./DetailDiv";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { getAdminDriverDetail } from "../../API/adminServices";

function DriverDetail({ open, setOpen, full }) {
  if (!open) return null;
  const { theme } = useTheme();
  const { selectedDriverId } = useGlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [driverDetailData, setDriverDetailData] = useState("");

  const fetchAdminDriverDetailData = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await getAdminDriverDetail(id);
      if (response) {
        console.log(response.data);
      }
      setDriverDetailData(response?.data?.data || {});
    } catch (error) {
      console.log("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminDriverDetailData(selectedDriverId);
  }, [fetchAdminDriverDetailData, selectedDriverId]);

  const logoutHandle = () => {
    navigate("/");
    setLogout(false);
  };

  // Helper function to format address
  const formatAddress = (data) => {
    const addressParts = [data?.city, data?.street, data?.houseNum].filter(Boolean);
    return addressParts.length > 0 ? addressParts.join(", ") : "Address Not Found";
  };

  // Helper function to get company names
  const getCompanyNames = (companies) => {
    if (!companies || companies.length === 0) return "No Companies Assigned";
    return companies
      .map(company => company.companyName || `Company ID: ${company.companyId}`)
      .join(", ");
  };

  // Helper function to format car info
  const formatCarInfo = (car) => {
    return `${car.make} ${car.model} (${car.vinNumber})`;
  };

  // Helper function to get status text and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "0":
        return { text: "Inactive", color: "text-red-500" };
      case "1":
        return { text: "Active", color: "text-green-500" };
      case "2":
        return { text: "Pending", color: "text-yellow-500" };
      default:
        return { text: "Unknown", color: "text-gray-500" };
    }
  };

  const statusInfo = getStatusInfo(driverDetailData?.status);

  console.log("selected driver id:", selectedDriverId);

  return (
    <motion.div
      className={`bg-black/50 backdrop-blur-lg overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%)] max-h-full poppins`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center py-10 w-full min-h-screen">
        <motion.div
          className={`rounded-xl w-[95%] max-w-4xl p-6 shadow flex flex-col items-center justify-center gap-4
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
          {/* Header */}
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
              Driver Details
            </p>
          </div>

          {loading ? (
            <div className={`${theme === "dark" ? "text-white" : "text-black"} text-center py-8`}>
              Loading driver details...
            </div>
          ) : (
            <div className="w-full space-y-6">
              {/* Basic Information */}
              <div className="w-full">
                <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailDiv
                    label="Driver Name"
                    value={`${driverDetailData?.name || ""} ${driverDetailData?.lastName || ""}`.trim() || "Name Not Found"}
                  />
                  <DetailDiv
                    label="Email"
                    value={driverDetailData?.email || "Email Not Found"}
                  />
                  <DetailDiv
                    label="Phone Number"
                    value={driverDetailData?.phNumber || "Phone Not Found"}
                  />
                  <DetailDiv
                    label="Gender"
                    value={driverDetailData?.gender || "Not Specified"}
                  />
                  <DetailDiv
                    label="Status"
                    value={statusInfo.text}
                    valueClassName={statusInfo.color}
                  />
                  <DetailDiv
                    label="User Type"
                    value={driverDetailData?.userType || "Not Specified"}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="w-full">
                <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailDiv
                    label="Address"
                    value={formatAddress(driverDetailData)}
                  />
                  <DetailDiv
                    label="Zip Code"
                    value={driverDetailData?.zipCode || "Not Available"}
                  />
                </div>
              </div>

              {/* Additional Information */}
              {full && (
                <div className="w-full">
                  <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailDiv
                      label="VAT Number"
                      value={driverDetailData?.vatNum || "VAT Not Found"}
                    />
                    <DetailDiv
                      label="Language"
                      value={driverDetailData?.lang === "ENG" ? "English" : driverDetailData?.lang || "Not Specified"}
                    />
                    <DetailDiv
                      label="Notification Status"
                      value={driverDetailData?.notification_status === 1 ? "Enabled" : "Disabled"}
                    />
                    <DetailDiv
                      label="Active Status"
                      value={driverDetailData?.active_status === 1 ? "Online" : "Offline"}
                    />
                  </div>
                </div>
              )}


              {/* Assigned Cars */}
              {driverDetailData?.cars && driverDetailData.cars.length > 0 && (
                <div className="w-full">
                  <h3 className={`${theme === "dark" ? "text-white" : "text-black"} text-lg font-semibold mb-3`}>
                    Assigned Cars ({driverDetailData.cars.length})
                  </h3>
                  <div className="space-y-4">
                    {driverDetailData.cars.map((car, index) => (
                      <div 
                        key={car.id}
                        className={`p-4 rounded-lg border ${
                          theme === "dark" 
                            ? "bg-[#2a2a2a] border-[#404040]" 
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-3">
                          <DetailDiv
                            label="Car"
                            value={formatCarInfo(car)}
                            compact
                          />
                          <DetailDiv
                            label="Number Plate"
                            value={car.numberPlate || "Not Available"}
                            compact
                          />
                          <DetailDiv
                            label="Mileage"
                            value={car.mileage ? `${car.mileage} km` : "Not Available"}
                            compact
                          />
                          <DetailDiv
                            label="Status"
                            value={car.status === "1" ? "Active" : "Inactive"}
                            valueClassName={car.status === "1" ? "text-green-500" : "text-red-500"}
                            compact
                          />
                          <DetailDiv
                            label="Owner"
                            value={car.owner_name || "Not Available"}
                            compact
                          />
                          <DetailDiv
                            label="Expired Documents"
                            value={car.expired === "1" ? "Yes" : "No"}
                            valueClassName={car.expired === "1" ? "text-red-500" : "text-green-500"}
                            compact
                          />
                        </div>
                        
                        {/* Maintenance Records */}
                        {car.maintenance && car.maintenance.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} text-sm font-medium mb-2`}>
                              Recent Maintenance: {car.maintenance.length} record(s)
                            </p>
                            <div className="text-sm">
                              {car.maintenance.map((maintenance, idx) => (
                                <div key={maintenance.id} className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                                  • {maintenance.serviceType} - {maintenance.date} ({maintenance.dealerName})
                                </div>
                              ))}
                             
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Driver Documents */}
             
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default DriverDetail;