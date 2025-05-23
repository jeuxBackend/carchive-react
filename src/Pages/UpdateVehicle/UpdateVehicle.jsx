import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../Contexts/ThemeContext";
import InputField from "./Input";
import ImageUploader from "./ImageUploader";
import Switch from "./Switch";
import DocumentUploader from "./DocumentUploader";
import BasicDatePicker from "../../Components/Buttons/BasicDatePicker";
import { toast } from "react-toastify";
import { updateVehicle, getMakes, deleteCarDocument } from "../../API/portalServices"; // Added deleteCarDocument
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MakesDropdown from "../../Components/DropDown/MakesDropDown";
import { useGlobalContext } from "../../Contexts/GlobalContext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { IoClose } from "react-icons/io5";

function UpdateVehicle() {
  const { theme } = useTheme();
  const { vehicle } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [vehicleImagePreviews, setVehicleImagePreviews] = useState([]);
  const [regDocs, setRegDocs] = useState([]);
  const [regDocPreviews, setRegDocPreviews] = useState([]);
  const [insuranceDocs, setInsuranceDocs] = useState([]);
  const [insuranceDocPreviews, setInsuranceDocPreviews] = useState([]);
  const [inspectionDocs, setInspectionDocs] = useState([]);
  const [inspectionDocPreviews, setInspectionDocPreviews] = useState([]);
  const [additionalDocs, setAdditionalDocs] = useState([]);
  const [additionalDocPreviews, setAdditionalDocPreviews] = useState([]);
  const [additionalDates, setAdditionalDates] = useState([null]); // Initialize with one null date
  const navigate = useNavigate();
  const [vehicleData, setVehicleData] = useState({
    vinNumber: "",
    make: "",
    model: "",
    insuranceExpiry: "",
    inspectionExpiry: "",
    registrationNumber: "",
    mileage: "",
    chassis: "",
    numberPlate: "",
    additionalExpiry: "",  // Keep for backward compatibility
    registrationExpiry: "",
    manufacturingYear: "",
    insuranceStatus: "0",
    registrationStatus: "0",
    inspectionStatus: "0",
    additionalStatus: "0",
    status: "",
    additionalTitles: "",
  });

  // Function to add a new date field
  const addDateField = () => {
    setAdditionalDates([...additionalDates, null]);
  };

  // Function to remove a date field
  const removeDateField = (index) => {
    if (additionalDates.length > 1) {
      const newDates = [...additionalDates];
      newDates.splice(index, 1);
      setAdditionalDates(newDates);
    } else {
      toast.error("At least one additional date is required");
    }
  };

  // Function to update a specific date
  const updateDate = (index, newDate) => {
    const updatedDates = [...additionalDates];
    updatedDates[index] = newDate;
    setAdditionalDates(updatedDates);
  };

  // Initialize form with existing vehicle data when component mounts
  useEffect(() => {
    if (vehicle) {
      setVehicleData({
        id: vehicle.id,
        vinNumber: vehicle.vinNumber || "",
        make: vehicle.make || "",
        model: vehicle.model || "",
        insuranceExpiry: vehicle.insuranceExpiry || "",
        inspectionExpiry: vehicle.inspectionExpiry || "",
        registrationNumber: vehicle.registrationNumber || "",
        mileage: vehicle.mileage || "",
        chassis: vehicle.chassis || "",
        numberPlate: vehicle.numberPlate || "",
        additionalExpiry: vehicle.additionalExpiry || "",
        registrationExpiry: vehicle.registrationExpiry || "",
        manufacturingYear: vehicle.manufacturingYear || "",
        insuranceStatus: vehicle.insuranceStatus?.toString() || "0",
        registrationStatus: vehicle.registrationStatus?.toString() || "0",
        inspectionStatus: vehicle.inspectionStatus?.toString() || "0",
        additionalStatus: vehicle.additionalStatus?.toString() || "0",
        status: vehicle.status || "0",
        additionalTitles: vehicle.additionalTitles || "",
      });

      // Initialize additionalDates from vehicle data
      if (vehicle.additionalExpiry) {
        // Check if additionalExpiry is an array (for new format)
        if (Array.isArray(vehicle.additionalExpiry)) {
          setAdditionalDates(vehicle.additionalExpiry.map(date => date ? dayjs(date).toDate() : null));
        } 
        // For backward compatibility - single date string
        else if (typeof vehicle.additionalExpiry === 'string' && vehicle.additionalExpiry) {
          setAdditionalDates([dayjs(vehicle.additionalExpiry).toDate()]);
        } 
        // Fallback
        else {
          setAdditionalDates([null]);
        }
      }

      // Initialize document arrays with existing data
      if (vehicle.image && Array.isArray(vehicle.image)) {
        setVehicleImagePreviews(vehicle.image);
      }
      
      if (vehicle.registrationDocument && Array.isArray(vehicle.registrationDocument)) {
        setRegDocPreviews(vehicle.registrationDocument);
      }
      
      if (vehicle.insuranceDocument && Array.isArray(vehicle.insuranceDocument)) {
        setInsuranceDocPreviews(vehicle.insuranceDocument);
      }
      
      // Handle inspectionDocument which could be an array of objects
      if (vehicle.inspectionDocument) {
        if (Array.isArray(vehicle.inspectionDocument)) {
          const formattedDocs = vehicle.inspectionDocument.map(doc => 
            typeof doc === 'object' && doc.image ? doc.image : doc
          );
          setInspectionDocPreviews(formattedDocs);
        }
      }
      
      if (vehicle.additionalDocuments && Array.isArray(vehicle.additionalDocuments)) {
        setAdditionalDocPreviews(vehicle.additionalDocuments);
      }
    }
  }, [vehicle]);

  // Function to handle document deletion
  const handleDocumentDelete = async (index, type) => {
    if (!vehicle?.id) {
      console.error("Vehicle ID is missing");
      return;
    }

    // Map the document type to the API expected format
    const docTypeMap = {
      'image': 'image',
      'registration': 'register',
      'insurance': 'insurance',
      'inspection': 'inspection',
      'additional': 'additional'
    };

    const apiType = docTypeMap[type];
    if (!apiType) {
      console.error("Invalid document type:", type);
      return;
    }

    setLoading(true);
    try {
      const response = await deleteCarDocument({
        carId: vehicle.id,
        index: index,
        type: apiType
      });

      if (response.data) {
        toast.success(`${type} document deleted successfully`);
      } else {
        toast.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("An error occurred while deleting the document");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (
      !vehicleData?.make ||
      !vehicleData?.model ||
      !vehicleData?.vinNumber 
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    if (vehicleData.vinNumber.length !== 17) {
      toast.error("VIN Number must be 17 characters");
      return false;
    }

    if (vehicleImages.length === 0 && vehicleImagePreviews.length === 0) {
      toast.error("Please add at least one vehicle image");
      return false;
    }

    
    return true;
  };

  const handleUpdateVehicle = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
  
      const newVehicleImages = vehicleImages.filter(img => !(typeof img === 'string' && img.startsWith('http')));
      const newRegDocs = regDocs.filter(doc => !(typeof doc === 'string' && doc.startsWith('http')));
      const newInsuranceDocs = insuranceDocs.filter(doc => !(typeof doc === 'string' && doc.startsWith('http')));
      const newInspectionDocs = inspectionDocs.filter(doc => !(typeof doc === 'string' && doc.startsWith('http')));
      const newAdditionalDocs = additionalDocs.filter(doc => !(typeof doc === 'string' && doc.startsWith('http')));

      const formattedDates = additionalDates.map(date => 
        date ? dayjs(date).format('YYYY-MM-DD') : ''
      );

      const updateData = {
        ...vehicleData,
        id: vehicle?.id, 
        image: newVehicleImages,
        registrationDocument: newRegDocs,
        insuranceDocument: newInsuranceDocs,
        inspectionDocument: newInspectionDocs,
        additionalDocuments: newAdditionalDocs,
        additionalExpiry: formattedDates 
      };
      
      const response = await updateVehicle(updateData);
      
      if (response.data) {
        toast.success("Vehicle updated successfully");
        navigate("/Vehicles");
      }
    } catch (error) {
      console.error("Update vehicle error:", error);

      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.error) {
          if (typeof errorData.error === 'object') {
            if (errorData.error.vinNumber && Array.isArray(errorData.error.vinNumber)) {
              toast.error(errorData.error.vinNumber[0]);
            } else if (errorData.error.message) {
              toast.error(errorData.error.message);
            } else {
              const firstErrorField = Object.keys(errorData.error)[0];
              if (firstErrorField && Array.isArray(errorData.error[firstErrorField])) {
                toast.error(errorData.error[firstErrorField][0]);
              } else {
                toast.error("Validation error. Please check your inputs.");
              }
            }
          } else if (Array.isArray(errorData.error)) {
            if (errorData.error.length > 0) {
              toast.error(errorData.error[0]);
            } else {
              toast.error("An error occurred during the update.");
            }
          } else if (typeof errorData.error === 'string') {
            toast.error(errorData.error);
          } else {
            toast.error("An unexpected error occurred.");
          }
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error("Failed to update vehicle. Please try again.");
        }
      } else if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const [makesData, setMakesData] = useState([]);

  const fetchMakesData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMakes();
      setMakesData(response?.data?.data || {});
    } catch (error) {
      console.error("Error fetching makes data:", error);
      toast.error("Failed to load vehicle makes. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMakesData();
  }, [fetchMakesData]);

  return (
    <div>
      <div className="flex gap-5 lg:flex-row flex-col">
        <div
          className={`w-full lg:w-[50%] ${
            theme === "dark"
              ? "bg-[#323335]"
              : "bg-white border border-[#ececec]"
          } p-4 rounded-xl`}
        >
          <p
            className={`${
              theme === "dark" ? "text-white" : "text-black"
            } text-[1.5rem] font-medium`}
          >
            Details
          </p>
          <div className="pt-3 flex flex-col gap-3">
          <p className='text-[#fff]'>Make*</p>

            <MakesDropdown
              label="Vehicle Make"
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="make"
              options={makesData}
            />
            <p className='text-[#fff]'>Model*</p>
            <InputField
              label="Model"
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="model"
            />
            <p className='text-[#fff]'>VIN Number*</p>
            <InputField
              label="Vin Number"
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="vinNumber"
            />
            <p className='text-[#fff]'>Miles</p>
            <InputField
              label="Miles"
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="mileage"
            />
            <p className='text-[#fff]'>Number Plate</p>
            <InputField
              label="Number Plate"
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="numberPlate"
            />
            <div className="flex gap-6 sm:gap-3 sm:flex-row flex-col pt-4">
              <BasicDatePicker
                label="Manufacturing Year"
                value={vehicleData}
                setValue={setVehicleData}
                fieldKey="manufacturingYear"
              />
              <BasicDatePicker
                label="Registration Expiry"
                value={vehicleData}
                setValue={setVehicleData}
                fieldKey="registrationExpiry"
              />
            </div>
            <div className="flex gap-6 sm:gap-3 sm:flex-row flex-col pt-4">
              <BasicDatePicker
                label="Insurance Expiry"
                value={vehicleData}
                setValue={setVehicleData}
                fieldKey="insuranceExpiry"
              />
              <BasicDatePicker
                label="Vehicle Inspection"
                value={vehicleData}
                setValue={setVehicleData}
                fieldKey="inspectionExpiry"
              />
            </div>
            {/* Removed the single Additional Documents Expiry field */}
          </div>
        </div>
        <div className="w-full lg:w-[50%] flex flex-col gap-3">
          <div
            className={`${
              theme === "dark"
                ? "bg-[#323335]"
                : "bg-white border border-[#ececec]"
            } p-4 rounded-xl`}
          >
            <p
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } text-[1.5rem] font-medium`}
            >
              Vehicle Images
            </p>
            <div className="">
              <ImageUploader
                value={vehicleImages}
                setValue={setVehicleImages}
                imageView={vehicleImagePreviews}
                setImageView={setVehicleImagePreviews}
                onDelete={handleDocumentDelete}
              />
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-[#323335]"
                : "bg-white border border-[#ececec]"
            } p-4 rounded-xl`}
          >
            <div>
              <p
                className={`${
                  theme === "dark" ? "text-white" : "text-black"
                } text-[1.5rem] font-medium flex items-center gap-2`}
              >
                Registration Documents{" "}
                <Switch
                  value={vehicleData}
                  setValue={setVehicleData}
                  fieldKey="registrationStatus"
                />
              </p>
              <div className="">
                <DocumentUploader 
                  value={regDocs} 
                  setValue={setRegDocs} 
                  documentView={regDocPreviews}
                  setDocumentView={setRegDocPreviews}
                  onDelete={handleDocumentDelete}
                  type="registration"
                />
              </div>
            </div>

            <div>
              <p
                className={`${
                  theme === "dark" ? "text-white" : "text-black"
                } text-[1.5rem] font-medium flex items-center gap-2`}
              >
                Insurance Documents{" "}
                <Switch
                  value={vehicleData}
                  setValue={setVehicleData}
                  fieldKey="insuranceStatus"
                />
              </p>
              <div className="">
                <DocumentUploader
                  value={insuranceDocs}
                  setValue={setInsuranceDocs}
                  documentView={insuranceDocPreviews}
                  setDocumentView={setInsuranceDocPreviews}
                  onDelete={handleDocumentDelete}
                  type="insurance"
                />
              </div>
            </div>

            <div>
              <p
                className={`${
                  theme === "dark" ? "text-white" : "text-black"
                } text-[1.5rem] font-medium flex items-center gap-2`}
              >
                Inspection Documents{" "}
                <Switch
                  value={vehicleData}
                  setValue={setVehicleData}
                  fieldKey="inspectionStatus"
                />
              </p>
              <div>
                <DocumentUploader
                  value={inspectionDocs}
                  setValue={setInspectionDocs}
                  documentView={inspectionDocPreviews}
                  setDocumentView={setInspectionDocPreviews}
                  onDelete={handleDocumentDelete}
                  type="inspection"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multiple Additional Dates Section - New Section */}
      <div 
        className={`${
          theme === "dark" 
            ? "bg-[#323335]" 
            : "bg-white border border-[#ececec]"
        } p-4 rounded-xl mt-3`}
      >
        <div className="flex justify-between items-center mb-4">
          <div 
            className={`${
              theme === "dark" ? "text-white" : "text-black"
            } text-[1.5rem] font-medium`}
          >
            Additional Document Dates
          </div>
          <button
            onClick={addDateField}
            className="bg-[#479cff] py-2 px-4 rounded-lg text-white text-sm font-medium"
          >
            Add Date
          </button>
        </div>

        {additionalDates.map((date, index) => (
          <div key={index} className="flex items-center gap-2 mb-4">
            <div className="flex-1">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={`Date ${index + 1}`}
                  value={date ? dayjs(date) : null}
                  onChange={(newValue) => updateDate(index, newValue)}
                  sx={{
                    width: "100%",
                    fontWeight: 500,
                    borderRadius: "0.75rem",
                    backgroundColor: theme === "dark" ? "#1b1c1e" : "#f7f7f7",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "transparent",
                      color: theme === "dark" ? "white" : "black",
                      borderRadius: "0.75rem",
                      border: theme === "dark" ? "none" : "1px solid #e8e8e8",
                      "& fieldset": {
                        borderRadius: "0.75rem",
                        border: theme === "dark" ? "none" : "1px solid #e8e8e8",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: theme === "dark" ? "white" : "black",
                    },
                    "& .MuiFormLabel-root": {
                      color: theme === "dark" ? "white" : "black",
                    },
                    "& .MuiIconButton-root": {
                      color: theme === "dark" ? "white" : "black",
                    },
                  }}
                />
              </LocalizationProvider>
            </div>
            <div
              onClick={() => removeDateField(index)}
              className="bg-red-500 py-3.5 px-3 rounded-lg text-white text-sm font-medium cursor-pointer"
              disabled={additionalDates.length === 1}
            >
              <IoClose />
            </div>
          </div>
        ))}
        {additionalDates.length === 0 && (
          <p className={`${theme === "dark" ? "text-red-400" : "text-red-500"} text-sm`}>
            At least one additional date is required
          </p>
        )}
      </div>

      <div className="w-full pt-3 flex flex-col gap-3">
        <div
          className={`${
            theme === "dark"
              ? "bg-[#323335]"
              : "bg-white border border-[#ececec]"
          } p-4 rounded-xl`}
        >
          <div>
            <p
              className={`${
                theme === "dark" ? "text-white" : "text-black"
              } text-[1.5rem] font-medium flex items-center gap-2`}
            >
              Additional Documents{" "}
              <Switch
                value={vehicleData}
                setValue={setVehicleData}
                fieldKey="additionalStatus"
              />
            </p>
            <div className="">
              <DocumentUploader
                value={additionalDocs}
                setValue={setAdditionalDocs}
                documentView={additionalDocPreviews}
                setDocumentView={setAdditionalDocPreviews}
                onDelete={handleDocumentDelete}
                type="additional"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center my-5">
        <div
          onClick={handleUpdateVehicle}
          className="bg-[#479cff] w-full md:w-[40%] py-4 rounded-2xl text-center font-medium text-white cursor-pointer"
        >
          {loading ? (
            <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto animate-spin" />
          ) : (
            "Update"
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateVehicle;