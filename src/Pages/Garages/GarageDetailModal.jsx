import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import DetailDiv from "./DetailDiv";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { getGarageDetail } from "../../API/portalServices";

function GarageDetailModal({ open, setOpen, full, setGarageId, garageId }) {
  if (!open) return null;
  
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [garageDetailData, setGarageDetailData] = useState("");
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [activeTab, setActiveTab] = useState("garage"); // "garage", "maintenance", "cars"
  const [expandedMaintenance, setExpandedMaintenance] = useState({});
  
  const fetchAdminGarageDetailData = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await getGarageDetail(id);
      if (response) {
        console.log("Full API Response:", response.data);
        setGarageDetailData(response?.data?.data?.garageData || {});
        setMaintenanceData(response?.data?.data?.Maintenance || []);
      }
    } catch (error) {
      console.log("Error while fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminGarageDetailData(garageId);
  }, [fetchAdminGarageDetailData, garageId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const parseServiceLine = (serviceLine) => {
    try {
      if (typeof serviceLine === 'string') {
        return JSON.parse(serviceLine);
      }
      return serviceLine || [];
    } catch (error) {
      console.log("Error parsing service line:", error);
      return [];
    }
  };

  const toggleMaintenanceExpansion = (id) => {
    setExpandedMaintenance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getUniqueCars = () => {
    const carsMap = new Map();
    maintenanceData.forEach(maintenance => {
      if (maintenance.car && maintenance.car.id) {
        carsMap.set(maintenance.car.id, maintenance.car);
      }
    });
    return Array.from(carsMap.values());
  };

  const StatusBadge = ({ status, type = "maintenance" }) => {
    const isActive = status === "1" || status === 1;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isActive 
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      }`}>
        {type === "maintenance" ? (isActive ? "Completed" : "Pending") : (isActive ? "Active" : "Inactive")}
      </span>
    );
  };

  const ExpiryBadge = ({ date, label }) => {
    if (!date) return null;
    
    const expiryDate = new Date(date);
    const today = new Date();
    const daysDifference = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    let bgColor = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    let status = "Valid";
    
    if (daysDifference < 0) {
      bgColor = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      status = "Expired";
    } else if (daysDifference <= 30) {
      bgColor = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      status = "Expiring Soon";
    }
    
    return (
      <div className="flex flex-col">
        <span className={`px-2 py-1 rounded text-xs font-medium ${bgColor}`}>
          {label}: {status}
        </span>
        <span className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {formatDate(date)} ({daysDifference > 0 ? `${daysDifference} days left` : `${Math.abs(daysDifference)} days overdue`})
        </span>
      </div>
    );
  };

  const renderGarageDetails = () => (
    <div className="w-full space-y-6">
      {/* Basic Information */}
      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#2a2b2d]" : "bg-gray-50"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailDiv label="Garage Name" value={garageDetailData?.name || "N/A"} />
          <DetailDiv label="Email Address" value={garageDetailData?.email || "N/A"} />
          <DetailDiv label="Phone Number" value={garageDetailData?.phone || "N/A"} />
          <DetailDiv label="Full Address" value={garageDetailData?.address || "N/A"} />
        </div>
      </div>

      {/* Address Details */}
      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#2a2b2d]" : "bg-gray-50"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
          Address Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DetailDiv label="City" value={garageDetailData?.city || "Not Specified"} />
          <DetailDiv label="Street" value={garageDetailData?.street || "Not Specified"} />
          <DetailDiv label="House Number" value={garageDetailData?.houseNum || "Not Specified"} />
          <DetailDiv label="Zip/Postal Code" value={garageDetailData?.zipCode || "Not Specified"} />
        </div>
      </div>

      {/* Garage Image */}
      {garageDetailData?.image && (
        <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#2a2b2d]" : "bg-gray-50"}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
            Garage Image
          </h3>
          <img 
            src={garageDetailData.image} 
            alt="Garage" 
            className="w-32 h-32 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Statistics */}
      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-[#2a2b2d]" : "bg-gray-50"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
          Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
              {maintenanceData.length}
            </div>
            <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Total Maintenance Records
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
              {maintenanceData.filter(m => m.status === "1").length}
            </div>
            <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Completed Services
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>
              {getUniqueCars().length}
            </div>
            <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Cars Serviced
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaintenanceHistory = () => (
    <div className="w-full space-y-4 max-h-[600px] overflow-y-auto">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <span className={theme === "dark" ? "text-white" : "text-black"}>Loading maintenance records...</span>
        </div>
      ) : maintenanceData.length === 0 ? (
        <div className="text-center py-8">
          <div className={`text-6xl mb-4 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>🔧</div>
          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            No maintenance records found
          </span>
        </div>
      ) : (
        maintenanceData.map((maintenance, index) => (
          <motion.div
            key={maintenance.id}
            className={`border rounded-lg overflow-hidden ${
              theme === "dark" 
                ? "bg-[#2a2b2d] border-[#404142]" 
                : "bg-white border-gray-200"
            } shadow-sm hover:shadow-md transition-shadow`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Maintenance Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>
                    {maintenance.serviceType}
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    ID: {maintenance.id} | VIN: {maintenance.vinNumber}
                  </p>
                </div>
                {/* <StatusBadge status={maintenance.status} /> */}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <DetailDiv label="Date" value={formatDate(maintenance.date)} />
                <DetailDiv label="Dealer" value={maintenance.dealerName} />
                <DetailDiv label="Mileage" value={`${maintenance.millage} km`} />
                <DetailDiv label="Garage ID" value={maintenance.grageId || "N/A"} />
              </div>

              <div className="flex justify-between items-center">
                <div className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  Created: {formatDateTime(maintenance.created_at)} | Updated: {formatDateTime(maintenance.updated_at)}
                </div>
                <button
                  onClick={() => toggleMaintenanceExpansion(maintenance.id)}
                  className={`text-sm px-3 py-1 rounded ${
                    theme === "dark" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  } transition-colors`}
                >
                  {expandedMaintenance[maintenance.id] ? "Show Less" : "Show More"}
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedMaintenance[maintenance.id] && (
              <div className="p-4 space-y-4">
                {/* Service Line Items */}
                <div>
                  <h5 className={`font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-black"}`}>
                    Service Items
                  </h5>
                  {parseServiceLine(maintenance.serviceLine).map((item, itemIndex) => (
                    <div key={itemIndex} className={`p-3 mb-2 rounded ${theme === "dark" ? "bg-[#1e1f21]" : "bg-gray-100"}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          {item.itemName}
                        </span>
                        {/* <StatusBadge status={item.status} /> */}
                      </div>
                      {item.remarks && (
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          <strong>Remarks:</strong> {item.remarks}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Car Details */}
                {maintenance.car && (
                  <div>
                    <h5 className={`font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Vehicle Information
                    </h5>
                    <div className={`p-4 rounded ${theme === "dark" ? "bg-[#1e1f21]" : "bg-gray-100"}`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <DetailDiv label="Make" value={maintenance.car.make} />
                        <DetailDiv label="Model" value={maintenance.car.model} />
                        <DetailDiv label="Number Plate" value={maintenance.car.numberPlate} />
                        <DetailDiv label="Manufacturing Year" value={maintenance.car.manufacturingYear} />
                        <DetailDiv label="Current Mileage" value={`${maintenance.car.mileage} km`} />
                        <DetailDiv label="Chassis Number" value={maintenance.car.chassis || "N/A"} />
                      </div>

                      {/* Document Status */}
                      <div className="mb-4">
                        <h6 className={`font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                          Document Status
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <ExpiryBadge date={maintenance.car.insuranceExpiry} label="Insurance" />
                          <ExpiryBadge date={maintenance.car.inspectionExpiry2} label="Inspection" />
                          {maintenance.car.registrationExpiry && (
                            <ExpiryBadge date={maintenance.car.registrationExpiry} label="Registration" />
                          )}
                          {maintenance.car.additionalExpiry && (
                            <ExpiryBadge date={maintenance.car.additionalExpiry} label="Additional" />
                          )}
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="space-y-3">
                        {maintenance.car.insuranceDocument && maintenance.car.insuranceDocument.length > 0 && (
                          <div>
                            <h6 className={`font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                              Insurance Documents
                            </h6>
                            <div className="flex flex-wrap gap-2">
                              {maintenance.car.insuranceDocument.map((doc, idx) => (
                                <img key={idx} src={doc} alt="Insurance" className="w-16 h-16 object-cover rounded border" />
                              ))}
                            </div>
                          </div>
                        )}

                        {maintenance.car.inspectionDocument && maintenance.car.inspectionDocument.length > 0 && (
                          <div>
                            <h6 className={`font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                              Inspection Documents
                            </h6>
                            <div className="flex flex-wrap gap-2">
                              {maintenance.car.inspectionDocument.map((doc, idx) => (
                                <div key={idx} className="relative">
                                  <img src={doc.image} alt="Inspection" className="w-16 h-16 object-cover rounded border" />
                                  {doc.expiry && (
                                    <div className={`absolute -bottom-1 -right-1 text-xs px-1 rounded ${
                                      theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"
                                    }`}>
                                      {formatDate(doc.expiry)}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                   
                    </div>
                  </div>
                )}

                {/* Garage Association */}
                {maintenance.car && maintenance.car.garages && maintenance.car.garages.length > 0 && (
                  <div>
                    <h5 className={`font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Associated Garages
                    </h5>
                    {maintenance.car.garages.map((garage, garageIdx) => (
                      <div key={garageIdx} className={`p-3 rounded ${theme === "dark" ? "bg-[#1e1f21]" : "bg-gray-100"}`}>
                        <div className="flex items-center gap-3 mb-2">
                          {garage.garageImage && (
                            <img src={garage.garageImage} alt="Garage" className="w-12 h-12 rounded-full object-cover" />
                          )}
                          <div>
                            <h6 className={`font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>
                              {garage.garageUserName}
                            </h6>
                            <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                              ID: {garage.garageId} | User ID: {garage.garageUserId}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <DetailDiv label="Email" value={garage.garageEmail} />
                          <DetailDiv label="Phone" value={garage.garagephNumber} />
                          <DetailDiv label="Address" value={garage.address} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );

  const renderCarsOverview = () => {
    const uniqueCars = getUniqueCars();
    
    return (
      <div className="w-full space-y-4 max-h-[600px] overflow-y-auto">
        {uniqueCars.length === 0 ? (
          <div className="text-center py-8">
            <div className={`text-6xl mb-4 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`}>🚗</div>
            <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              No cars found in maintenance records
            </span>
          </div>
        ) : (
          uniqueCars.map((car, index) => (
            <motion.div
              key={car.id}
              className={`p-6 rounded-lg border ${
                theme === "dark" 
                  ? "bg-[#2a2b2d] border-[#404142]" 
                  : "bg-white border-gray-200"
              } shadow-sm`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>
                    {car.make} {car.model}
                  </h4>
                  <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {car.numberPlate} | VIN: {car.vinNumber}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
                    {maintenanceData.filter(m => m.carId === car.id.toString()).length}
                  </div>
                  <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Services
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <DetailDiv label="Manufacturing Year" value={car.manufacturingYear} />
                <DetailDiv label="Current Mileage" value={`${car.mileage} km`} />
                <DetailDiv label="Chassis" value={car.chassis || "N/A"} />
                <DetailDiv label="Car ID" value={car.id} />
              </div>

              {/* Expiry Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <ExpiryBadge date={car.insuranceExpiry} label="Insurance" />
                <ExpiryBadge date={car.inspectionExpiry2} label="Inspection" />
                {car.registrationExpiry && (
                  <ExpiryBadge date={car.registrationExpiry} label="Registration" />
                )}
                {car.additionalExpiry && (
                  <ExpiryBadge date={car.additionalExpiry} label="Additional" />
                )}
              </div>

              {/* Recent Services */}
              <div>
                <h5 className={`font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
                  Recent Services
                </h5>
                <div className="space-y-2">
                  {maintenanceData
                    .filter(m => m.carId === car.id.toString())
                    .slice(0, 3)
                    .map(service => (
                      <div key={service.id} className={`p-2 rounded text-sm ${theme === "dark" ? "bg-[#1e1f21]" : "bg-gray-100"}`}>
                        <div className="flex justify-between items-center">
                          <span>{service.serviceType}</span>
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                            {formatDate(service.date)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    );
  };



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
          className={`rounded-xl w-[90%] p-6 sm:w-[50rem] lg:w-[60rem] shadow flex flex-col items-center justify-center gap-4
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
              Garage Details
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex w-full border-b border-gray-300 dark:border-gray-600">
            <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "garage"
                  ? `border-b-2 border-blue-500 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`
                  : `${theme === "dark" ? "text-gray-400" : "text-gray-600"} hover:${theme === "dark" ? "text-gray-200" : "text-gray-800"}`
              }`}
              onClick={() => setActiveTab("garage")}
            >
              Garage Info
            </button>
            <button
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "maintenance"
                  ? `border-b-2 border-blue-500 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`
                  : `${theme === "dark" ? "text-gray-400" : "text-gray-600"} hover:${theme === "dark" ? "text-gray-200" : "text-gray-800"}`
              }`}
              onClick={() => setActiveTab("maintenance")}
            >
              Maintenance History ({maintenanceData.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === "garage" ? renderGarageDetails() : renderMaintenanceHistory()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default GarageDetailModal;