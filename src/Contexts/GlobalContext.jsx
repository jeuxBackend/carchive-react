import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [addInvoice, setAddInvoice] = useState(false);
  const [addAbout, setAddAbout] = useState(false);
  const [addTerm, setAddTerm] = useState(false);
  const [addPrivacy, setAddPrivacy] = useState(false);
  const [addTransfer, setAddTransfer] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState("");
  const [selectedGarageId, setSelectedGarageId] = useState("");
  const [companyId, setCompanyId] = useState(
    localStorage.getItem("companyId") || ""
  );
  useEffect(() => {
    if (companyId) {
      localStorage.setItem("companyId", companyId);
    } else {
      localStorage.removeItem("companyId");
    }
  }, [companyId]);

  const [vehicle, setVehicle] = useState(() => {
    const savedvehicle = localStorage.getItem("vehicle");
    return savedvehicle ? JSON.parse(savedvehicle) : {};
  });

  useEffect(() => {
    if (vehicle !== null) {
      localStorage.setItem("vehicle", JSON.stringify(vehicle));
    }
  }, [vehicle]);
  const [vehicleData, setSearchVehicleData] = useState(() => {
    const savedvehicleData = localStorage.getItem("vehicleData");
    return savedvehicleData ? JSON.parse(savedvehicleData) : {};
  });

  useEffect(() => {
    if (vehicleData !== null) {
      localStorage.setItem("vehicleData", JSON.stringify(vehicleData));
    }
  }, [vehicleData]);
  const [currentUserId, setCurrentUserId] = useState(() => {
    const savedcurrentUserId = localStorage.getItem("currentUserId");
    return savedcurrentUserId ? JSON.parse(savedcurrentUserId) : {};
  });

  useEffect(() => {
    if (currentUserId !== null) {
      localStorage.setItem("currentUserId", JSON.stringify(currentUserId));
    }
  }, [currentUserId]);
  const [currentUserCompanyId, setCurrentUserCompanyId] = useState(() => {
    const savedcurrentUserCompanyId = localStorage.getItem("currentUserCompanyId");
    return savedcurrentUserCompanyId ? JSON.parse(savedcurrentUserCompanyId) : {};
  });

  useEffect(() => {
    if (currentUserCompanyId !== null) {
      localStorage.setItem("currentUserCompanyId", JSON.stringify(currentUserCompanyId));
    }
  }, [currentUserCompanyId]);
  const [addRecord, setAddRecord] = useState(false);
  return (
    <GlobalContext.Provider
      value={{
        addInvoice,
        setAddInvoice,
        addAbout,
        setAddAbout,
        addPrivacy,
        setAddPrivacy,
        companyId,
        setCompanyId,
        selectedDriverId,
        setSelectedDriverId,
        selectedGarageId,
        setSelectedGarageId,
        vehicle, setVehicle,
        addRecord, setAddRecord,
        addTransfer, setAddTransfer,
        vehicleData, setSearchVehicleData,
        currentUserId, setCurrentUserId,
        addRecord,
        setAddRecord,
        addTransfer,
        setAddTransfer,
        vehicleData,
        setSearchVehicleData,
        addTerm,
        setAddTerm, currentUserCompanyId, setCurrentUserCompanyId
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
