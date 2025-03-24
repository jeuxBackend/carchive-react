import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [addInvoice, setAddInvoice] = useState(false);
  const [addAbout, setAddAbout] = useState(false);
  const [addPrivacy, setAddPrivacy] = useState(false);
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
        addRecord, setAddRecord
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
