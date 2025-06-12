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
import { useTranslation } from "react-i18next";


function UpdateVehicle() {
  const { t } = useTranslation();
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
  const [additionalDates, setAdditionalDates] = useState([])
  const [additionalTitles, setAdditionalTitles] = useState([])
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
      });

      // Initialize additional titles
      if (vehicle.additionalTitles) {
        if (Array.isArray(vehicle.additionalTitles)) {
          setAdditionalTitles(vehicle.additionalTitles);
        }
        // For backward compatibility - single title string
        else if (typeof vehicle.additionalTitles === 'string') {
          setAdditionalTitles([vehicle.additionalTitles]);
        }
        // Fallback
        else {
          setAdditionalTitles([]);
        }
      } else {
        setAdditionalTitles([]);
      }

      // Initialize additional dates
      if (vehicle.additionalExpiry) {
        if (Array.isArray(vehicle.additionalExpiry)) {
          setAdditionalDates(vehicle.additionalExpiry.map(date => date || ""));
        }
        // For backward compatibility - single date string
        else if (typeof vehicle.additionalExpiry === 'string' && vehicle.additionalExpiry) {
          setAdditionalDates([vehicle.additionalExpiry]);
        }
        // Fallback
        else {
          setAdditionalDates([]);
        }
      } else {
        setAdditionalDates([]);
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

      // Format dates properly
      const formattedDates = additionalDates.map(date => {
        if (!date) return '';
        // If it's already in YYYY-MM-DD format, return as is
        if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return date;
        }
        // If it's a Date object or other format, convert using dayjs
        return dayjs(date).format('YYYY-MM-DD');
      });

      const updateData = {
        ...vehicleData,
        id: vehicle?.id,
        image: newVehicleImages,
        registrationDocument: newRegDocs,
        insuranceDocument: newInsuranceDocs,
        inspectionDocument: newInspectionDocs,
        additionalDocuments: newAdditionalDocs,
        additionalExpiry: formattedDates,
        additionalTitles: additionalTitles
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
          className={`w-full lg:w-[50%] ${theme === "dark" ? "bg-[#323335]" : "bg-white  border border-[#ececec]"
            } p-4 rounded-xl`}
        >
          <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>
            {t("details")}
          </p>

          <div  className="pt-3 flex flex-col gap-3">
            <p>{t("make")}*</p>
            <MakesDropdown
              label={t("vehicle_make")}
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="make"
              options={makesData}
            />

            <p >{t("model")}*</p>
            <InputField
              label={t("model")}
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="model"
            />

            <p >{t("vin_number")}*</p>
            <InputField
              label={t("vin_number")}
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="vinNumber"
            />

            <p >{t("miles")}</p>
            <InputField
              label={t("miles")}
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="mileage"
              isNumber={true}
            />

            <p >{t("number_plate")}</p>
            <InputField
              label={t("number_plate")}
              value={vehicleData}
              setValue={setVehicleData}
              fieldKey="numberPlate"
              isCapital={true}
            />

            <div className="flex gap-6 sm:gap-3 sm:flex-row flex-col pt-4">
              <BasicDatePicker
                label={t("manufacturing_year")}
                value={vehicleData}
                setValue={setVehicleData}
                fieldKey="manufacturingYear"
              />
              <BasicDatePicker
                label={t("registration_date")}
                value={vehicleData}
                setValue={setVehicleData}
                fieldKey="registrationExpiry"
              />
            </div>

            <div className="flex gap-6 sm:gap-3 sm:flex-row flex-col pt-4">
              <BasicDatePicker
                label={t("insurance_expiry")}
                value={vehicleData}
                setValue={setVehicleData}
                fieldKey="insuranceExpiry"
              />
              <BasicDatePicker
                label={t("inspection_expiry")}
                value={vehicleData}
                setValue={setVehicleData}
                fieldKey="inspectionExpiry"
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[50%] flex flex-col gap-3">
          <div className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
            <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium`}>
              {t("vehicle_images")}
            </p>
            <div>
              <ImageUploader
                value={vehicleImages}
                setValue={setVehicleImages}
                imageView={vehicleImagePreviews}
                setImageView={setVehicleImagePreviews}
                onDelete={handleDocumentDelete}
              />
            </div>
          </div>

          <div className={`${theme === "dark" ? "bg-[#323335]" : "bg-white border border-[#ececec]"} p-4 rounded-xl`}>
            <div>
              <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>
                {t("registration_documents")}
                <Switch value={vehicleData} setValue={setVehicleData} fieldKey="registrationStatus" />
              </p>
              <div>
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
              <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>
                {t("insurance_documents")}
                <Switch value={vehicleData} setValue={setVehicleData} fieldKey="insuranceStatus" />
              </p>
              <div>
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
              <p className={`${theme === "dark" ? "text-white" : "text-black"} text-[1.5rem] font-medium flex items-center gap-2`}>
                {t("inspection_documents")}
                <Switch value={vehicleData} setValue={setVehicleData} fieldKey="inspectionStatus" />
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

      <div className="w-full pt-3 flex flex-col gap-3">
        <div
          className={`${theme === "dark"
            ? "bg-[#323335]"
            : "bg-white border border-[#ececec]"
            } p-4 rounded-xl`}
        >
          <div>
            <p
              className={`${theme === "dark" ? "text-white" : "text-black"
                } text-[1.5rem] font-medium flex items-center gap-2`}
            >
              {t("additional_documents")}
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
                setAdditionalDates={setAdditionalDates}
                setAdditionalTitles={setAdditionalTitles}
                additionalTitles={additionalTitles}
                additionalDates={additionalDates}
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
            t("update")
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateVehicle;