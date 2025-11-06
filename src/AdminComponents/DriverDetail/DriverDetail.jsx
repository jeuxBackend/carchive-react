import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../Contexts/ThemeContext";
import back from "../../assets/back.png";
import backLight from "../../assets/backLight.png";
import DetailDiv from "./DetailDiv";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { getAdminDriverDetail } from "../../API/adminServices";
import { countries } from "country-data";

// Image Modal Component
const ImageModal = ({ isOpen, onClose, imageUrl, title, theme }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`relative max-w-4xl max-h-[90vh] rounded-lg overflow-hidden ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-white"
          }`}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`p-4 border-b ${theme === "dark" ? "border-[#323335]" : "border-gray-200"
            }`}
        >
          <div className="flex justify-between items-center">
            <h3
              className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"
                }`}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className={`text-2xl hover:opacity-70 ${theme === "dark" ? "text-white" : "text-black"
                }`}
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto max-h-[70vh] object-contain rounded"
            onError={(e) => {
              console.log("Image failed to load:", imageUrl);
              e.target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTAwIDkwQzEwNS41MjMgOTAgMTEwIDg1LjUyMyAxMTAgODBDMTEwIDc0LjQ3NyAxMDUuNTIzIDcwIDEwMCA3MEM5NC40NzcgNzAgOTAgNzQuNDc3IDkwIDgwQzkwIDg1LjUyMyA5NC40NzcgOTAgMTAwIDkwWiIgZmlsbD0iIzlCA0EzRiIvPjxwYXRoIGQ9Ik0xNzUgMTQwTDE0NS44MzMgMTEwLjgzM0MxNDEuNjY3IDEwNi42NjcgMTM1IDEwNi42NjcgMTMwLjgzMyAxMTAuODMzTDEwNSAxMzYuNjY3TDgyLjUgMTE0LjE2N0M3OC4zMzMzIDExMCA3MS42NjY3IDExMCA2Ny41IDExNC4xNjdMMjUgMTU2LjY2N1YxNzVDMjUgMTgwLjUyMyAyOS40NzcgMTg1IDM1IDE4NUgxNjVDMTcwLjUyMyAxODUgMTc1IDE4MC41MjMgMTc1IDE3NVYxNDBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+";
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};


function DriverDetail({ open, setOpen, full }) {
  if (!open) return null;
  const { theme } = useTheme();
  const { selectedDriverId } = useGlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [driverDetailData, setDriverDetailData] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);


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

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl, basePath = "") => {
    if (!imageUrl) return null;

    // If URL already starts with http/https, return as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // If it's just a filename, prepend the base path
    return `https://api.carchive.be/${basePath}${imageUrl}`;
  };

  // Helper function to format address
  const formatAddress = (data) => {
    const addressParts = [data?.city, data?.street, data?.houseNum].filter(
      Boolean
    );
    return addressParts.length > 0
      ? addressParts.join(", ")
      : "Address Not Found";
  };

  // Helper function to get company names
  const getCompanyNames = (companies) => {
    if (!companies || companies.length === 0) return "No Companies Assigned";
    return companies
      .map(
        (company) => company.companyName || `Company ID: ${company.companyId}`
      )
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
        return { text: "Active", color: "text-green-500" };
      case "1":
        return { text: "Inactive", color: "text-red-500" };
      case "2":
        return { text: "Pending", color: "text-yellow-500" };
      default:
        return { text: "Unknown", color: "text-gray-500" };
    }
  };

  // Handle image click
  const handleImageClick = (imageUrl, title) => {
    console.log("Opening image:", imageUrl, title);
    setSelectedImage({ url: imageUrl, title });
    setImageModalOpen(true);
  };

  // Close image modal
  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  const statusInfo = getStatusInfo(driverDetailData?.status);

  console.log("selected driver id:", selectedDriverId);
  console.log("Driver detail data:", driverDetailData);

  // code to extarct country code
  const getCountryDialCode = (countryCode) => {
    if (!countryCode) return "";

    const country = countries[countryCode.toUpperCase()];

    if (country && country.countryCallingCodes?.length > 0) {
      return country.countryCallingCodes[0];
    }

    return "";
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
          className={`rounded-xl w-[95%] max-w-4xl p-6 shadow flex flex-col items-center justify-center gap-4
            ${theme === "dark"
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
              className={`${theme === "dark" ? "text-white" : "text-black"
                } text-[1.2rem] xxs:text-[1.5rem] sm:text-[2rem] font-medium`}
            >
              Driver Details
            </p>
          </div>

          {loading ? (
            <div
              className={`${theme === "dark" ? "text-white" : "text-black"
                } text-center py-8`}
            >
              Loading driver details...
            </div>
          ) : (
            <div className="w-full space-y-6">
              {/* Driver Profile Image */}
              {driverDetailData?.image && (
                <div className="w-full flex justify-center">
                  <div className="relative">
                    <img
                      src={getImageUrl(
                        driverDetailData.image,
                        "Profile_Images/"
                      )}
                      alt="Driver Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() =>
                        handleImageClick(
                          getImageUrl(
                            driverDetailData.image,
                            "Profile_Images/"
                          ),
                          "Driver Profile Picture"
                        )
                      }
                      onError={(e) => {
                        console.log(
                          "Profile image failed to load:",
                          e.target.src
                        );
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIxMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTAwIDEwMEM4My40MzE1IDEwMCA3MCA4Ni41Njg1IDcwIDcwQzcwIDUzLjQzMTUgODMuNDMxNSA0MCAxMDAgNDBDMTE2LjU2OSA0MCAxMzAgNTMuNDMxNSAxMzAgNzBDMTMwIDg2LjU2ODUgMTE2LjU2OSAxMDAgMTAwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz48cGF0aCBkPSJNMTAwIDEyMEM3NC42MjQzIDEyMCA1NCAxNDAuNjI0IDU0IDE2NlYyMDBIMTQ2VjE2NkMxNDYgMTQwLjYyNCAxMjUuMzc2IDEyMCAxMDAgMTIwWiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg==";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="w-full">
                <h3
                  className={`${theme === "dark" ? "text-white" : "text-black"
                    } text-lg font-semibold mb-3`}
                >
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailDiv
                    label="Driver Name"
                    value={
                      `${driverDetailData?.name || ""} ${driverDetailData?.lastName || ""
                        }`.trim() || "Name Not Found"
                    }
                  />
                  <DetailDiv
                    label="Email"
                    value={driverDetailData?.email || "Email Not Found"}
                  />
                  {/* <DetailDiv
                    label="Phone Number"
                    value={driverDetailData?.phNumber || "Phone Not Found"}
                  /> */}
                  <DetailDiv
                    label="Phone Number"
                    value={
                      driverDetailData?.phNumber
                        ? `${getCountryDialCode(driverDetailData?.phCountryCode)} ${driverDetailData?.phNumber}`
                        : "Phone Not Found"
                    }
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
              {/* <div className="w-full">
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
              </div> */}

              {/* Additional Information */}
              {full && (
                <div className="w-full">
                  <h3
                    className={`${theme === "dark" ? "text-white" : "text-black"
                      } text-lg font-semibold mb-3`}
                  >
                    Additional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailDiv
                      label="VAT Number"
                      value={driverDetailData?.vatNum || "VAT Not Found"}
                    />
                    <DetailDiv
                      label="Language"
                      value={
                        driverDetailData?.lang === "ENG"
                          ? "English"
                          : driverDetailData?.lang || "Not Specified"
                      }
                    />
                    <DetailDiv
                      label="Notification Status"
                      value={
                        driverDetailData?.notification_status === 1
                          ? "Enabled"
                          : "Disabled"
                      }
                    />
                    <DetailDiv
                      label="Active Status"
                      value={
                        driverDetailData?.active_status === 1
                          ? "Online"
                          : "Offline"
                      }
                    />
                  </div>
                </div>
              )}

              {/* Driver Documents */}
              {driverDetailData?.driver && (
                <div className="w-full">
                  <h3
                    className={`${theme === "dark" ? "text-white" : "text-black"
                      } text-lg font-semibold mb-3`}
                  >
                    Driver Documents
                  </h3>

                  {/* Driver License/ID Documents */}
                  {driverDetailData.driver.documents &&
                    driverDetailData.driver.documents.length > 0 && (
                      <div className="mb-4">
                        <h4
                          className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"
                            } text-md font-medium mb-2`}
                        >
                          License Documents (
                          {driverDetailData.driver.documents.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {driverDetailData.driver.documents.map(
                            (docUrl, index) => {
                              // Use the URL as is since it's already complete in the API response
                              const fullDocUrl = docUrl;
                              console.log("Document URL:", fullDocUrl);

                              return (
                                <div
                                  key={index}
                                  onClick={() =>
                                    handleImageClick(
                                      fullDocUrl,
                                      `Driver License Document ${index + 1}`
                                    )
                                  }
                                  className="relative group"
                                >
                                  <img
                                    src={fullDocUrl}
                                    alt={`Driver Document ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-all duration-200 hover:shadow-lg"
                                    onError={(e) => {
                                      console.log(
                                        "Document image failed to load:",
                                        fullDocUrl
                                      );
                                      e.target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTAwIDkwQzEwNS41MjMgOTAgMTEwIDg1LjUyMyAxMTAgODBDMTEwIDc0LjQ3NyAxMDUuNTIzIDcwIDEwMCA3MEM5NC40NzcgNzAgOTAgNzQuNDc3IDkwIDgwQzkwIDg1LjUyMyA5NC40NzcgOTAgMTAwIDkwWiIgZmlsbD0iIzlDQTNBRiIvPjxwYXRoIGQ9Ik0xNzUgMTQwTDE0NS44MzMgMTEwLjgzM0MxNDEuNjY3IDEwNi42NjcgMTM1IDEwNi42NjcgMTMwLjgzMyAxMTAuODMzTDEwNSAxMzYuNjY3TDgyLjUgMTE0LjE2N0M3OC4zMzMzIDExMCA3MS42NjY3IDExMCA2Ny41IDExNC4xNjdMMjUgMTU2LjY2N1YxNzVDMjUgMTgwLjUyMyAyOS40NzcgMTg1IDM1IDE4NUgxNjVDMTcwLjUyMyAxODUgMTc1IDE4MC41MjMgMTc1IDE3NVYxNDBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+";
                                    }}
                                  />
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                  {/* Driver Detail Images */}
                  {driverDetailData.driver.details &&
                    driverDetailData.driver.details.length > 0 && (
                      <div className="mb-4">
                        <h4
                          className={`${theme === "dark" ? "text-gray-300" : "text-gray-700"
                            } text-md font-medium mb-2`}
                        >
                          Additional Details (
                          {driverDetailData.driver.details.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {driverDetailData.driver.details.map(
                            (detailUrl, index) => {
                              // Use the URL as is since it's already complete in the API response
                              const fullDetailUrl = detailUrl;
                              console.log("Detail URL:", fullDetailUrl);

                              return (
                                <div
                                  onClick={() =>
                                    handleImageClick(
                                      fullDetailUrl,
                                      `Driver Detail Image ${index + 1}`
                                    )
                                  }
                                  key={index}
                                  className="relative group"
                                >
                                  <img
                                    src={fullDetailUrl}
                                    alt={`Driver Detail ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-300 cursor-pointer hover:border-blue-500 transition-all duration-200 hover:shadow-lg"
                                    onError={(e) => {
                                      console.log(
                                        "Detail image failed to load:",
                                        fullDetailUrl
                                      );
                                      e.target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGM0Y0RjYiLz48cGF0aCBkPSJNMTAwIDkwQzEwNS41MjMgOTAgMTEwIDg1LjUyMyAxMTAgODBDMTEwIDc0LjQ3NyAxMDUuNTIzIDcwIDEwMCA3MEM5NC40NzcgNzAgOTAgNzQuNDc3IDkwIDgwQzkwIDg1LjUyMyA5NC40NzcgOTAgMTAwIDkwWiIgZmlsbD0iIzlDQTNBRiIvPjxwYXRoIGQ9Ik0xNzUgMTQwTDE0NS44MzMgMTEwLjgzM0MxNDEuNjY3IDEwNi42NjcgMTM1IDEwNi42NjcgMTMwLjgzMyAxMTAuODMzTDEwNSAxMzYuNjY3TDgyLjUgMTE0LjE2N0M3OC4zMzMzIDExMCA3MS42NjY3IDExMCA2Ny41IDExNC4xNjdMMjUgMTU2LjY2N1YxNzVDMjUgMTgwLjUyMyAyOS40NzcgMTg1IDM1IDE4NUgxNjVDMTcwLjUyMyAxODUgMTc1IDE4MC41MjMgMTc1IDE3NVYxNDBaIiBmaWxsPSIjOUNBM0FGIi8+PC9zdmc+";
                                    }}
                                  />
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                  {/* No Documents Message */}
                  {(!driverDetailData.driver.documents ||
                    driverDetailData.driver.documents.length === 0) &&
                    (!driverDetailData.driver.details ||
                      driverDetailData.driver.details.length === 0) && (
                      <div
                        className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"
                          } text-center py-4`}
                      >
                        No documents available for this driver.
                      </div>
                    )}
                </div>
              )}

              {/* Assigned Cars */}
              {driverDetailData?.cars && driverDetailData.cars.length > 0 && (
                <div className="w-full">
                  <h3
                    className={`${theme === "dark" ? "text-white" : "text-black"
                      } text-lg font-semibold mb-3`}
                  >
                    Assigned Cars ({driverDetailData.cars.length})
                  </h3>
                  <div className="space-y-4">
                    {driverDetailData.cars.map((car, index) => (
                      <div
                        key={car.id}
                        className={`p-4 rounded-lg border ${theme === "dark"
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
                            value={
                              car.mileage
                                ? `${car.mileage} km`
                                : "Not Available"
                            }
                            compact
                          />
                          <DetailDiv
                            label="Status"
                            value={car.status === "1" ? "Active" : "Inactive"}
                            valueClassName={
                              car.status === "1"
                                ? "text-green-500"
                                : "text-red-500"
                            }
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
                            valueClassName={
                              car.expired === "1"
                                ? "text-red-500"
                                : "text-green-500"
                            }
                            compact
                          />
                        </div>

                        {/* Maintenance Records */}
                        {car.maintenance && car.maintenance.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p
                              className={`${theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                                } text-sm font-medium mb-2`}
                            >
                              Recent Maintenance: {car.maintenance.length}{" "}
                              record(s)
                            </p>
                            <div className="text-sm">
                              {car.maintenance.map((maintenance, idx) => (
                                <div
                                  key={maintenance.id}
                                  className={`${theme === "dark"
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                    }`}
                                >
                                  • {maintenance.serviceType} -{" "}
                                  {maintenance.date} ({maintenance.dealerName})
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
            </div>
          )}
        </motion.div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={imageModalOpen}
        onClose={closeImageModal}
        imageUrl={selectedImage?.url}
        title={selectedImage?.title}
        theme={theme}
      />
    </motion.div>
  );
}

export default DriverDetail;
