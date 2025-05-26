import API from "./portalAPI";

// AUTH API's
export const portalLogin = (credentials) => API.post("/login", credentials);
export const portalRegistration = (data) => API.post("/registerCompany", data);
export const portalForgot = (data) => API.post("/forgot", data);

// Dashboard API's
export const getDashboard = () => API.get("/portal/portal-dashboard");

// Vehicles API's
export const addVehicle = (data) => API.post("/portal/storeCar", data);
export const updateVehicle = (data) => API.post("/portal/updateCar", data);
export const getVehicles = () => API.get("/portal/vehicles");
export const getVehicleById = (id) => API.get(`/portal/vehicle-details/${id}`);
export const archiveVehicle = (id) => API.get(`/portal/makeArchive/${id}`);
export const delVehicle = (id) => API.delete(`/portal/deleteCar/${id}`);
export const assignDriver = (data) => API.post(`/portal/getDriverByEmail`, data);
export const unassignDriver = (carId, driverId) => API.get(`portal/unassignCar/${carId}/${driverId}`);
export const maintenanceRecord = (id) => API.get(`portal/viewMaintenanceRequestPortal/${id}`);
export const getMakes = () => API.get("/getMakes");
export const createMaintenanceRecord = (data) => API.post("portal/createMaintenanceRequestPortal", data);
export const getLogs= (id) => API.get(`/portal/viewLog/${id}`);
export const releaseVehicle= (id) => API.get(`/portal/soldCar/${id}`);
export const getGarages= (id) => API.get(`/portal/getCarGarages/${id}`);
export const searchVehicle= (data) => API.post(`/portal/getCarWithVin`, data);
export const buyCarApi= (data) => API.post(`/portal/buyCar`, data);
export const deleteCarDocument = (data) => API.post(`/portal/deleteCarDocument`, data);

// Drivers API's
export const getDrivers = () => API.get("/portal/getCompanyDrivers");
export const delDriver = (companyId) => API.get(`/portal/deleteDriver/${companyId}`);
export const getCarsbyDriver = (id) => API.get(`portal/getDriverCarsById/${id}`);

// Garages API's
export const getGaragesList = () => API.get("/portal/getCompanyCarGarages");

// Invoices API's
export const getInvoices = () => API.get("/portal/get-invoices");

// Requests API's
export const getRequests = () => API.get("/portal/getCustomerRequests");
export const changeRequestStatus = (data) => API.post("/portal/respondCustomerRequests", data);
export const changeGarageStatus = (data) => API.post("/portal/updateDocumentRequest", data);


// Settings API's
export const getSettings = () => API.get("/getSettings");
export const getProfile = () => API.get("/user");
export const updateProfile = (data) => API.post("/portal/updateProfile",data);

