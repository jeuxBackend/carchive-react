import API from "./portalAPI";

// AUTH API's
export const portalLogin = (credentials) => API.post("/login", credentials);
export const portalRegistration = (data) => API.post("/registerCompany", data);
export const portalForgot = (data) => API.post("/forgot", data);

// Dashboard API's
export const getDashboard = () => API.get("/portal/portal-dashboard");

// Vehicles API's
export const addVehicle = (data) => API.post("/portal/storeCar", data);
export const getVehicles = () => API.get("/portal/vehicles");
export const getVehicleById = (id) => API.get(`/portal/vehicle-details/${id}`);
export const archiveVehicle = (id) => API.get(`/portal/makeArchive/${id}`);
export const delVehicle = (id) => API.delete(`/portal/deleteCar/${id}`);
export const assignDriver = (data) => API.post(`/portal/getDriverByEmail`, data);
export const getMakes = () => API.get("/getMakes");

// Invoices API's
export const getInvoices = () => API.get("/portal/get-invoices");

// Settings API's
export const getSettings = () => API.get("/getSettings");

