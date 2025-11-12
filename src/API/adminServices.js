import API from "./adminAPI";

// Utility function for POST requests
const postRequest = (endpoint, data = {}) => API.post(endpoint, data);

// Admin Authentication API
export const adminLogin = (credentials) => postRequest("admin/login", credentials);

// Dashboard API
export const getAdminDashboard = () => API.get("admin/dashboard");

// Accept/Reject Garage/Company/Driver APIs
export const acceptReject = (data) => postRequest("admin/accept-reject-user", data);

// Company APIs
export const getAdminCompanies = (data) => postRequest("admin/all-companies", data);
export const getApproveAdminCompanies = (data) => postRequest("admin/approved-companies", data);
export const getUnapproveAdminCompanies = (data) => postRequest("admin/unapproved-companies", data);
export const getAdminCompanyDetail = (id) => postRequest("admin/company-detail", { id });
export const getInactiveAdminCompanies = (data) => postRequest("admin/get-unactive-companys", data);


// Driver APIs
export const getAllAdminDrivers = (data) => postRequest("admin/drivers", data);
export const getApproveAdminDrivers = (data) => postRequest("admin/approved-drivers", data);
export const getUnapproveAdminDrivers = (data) => postRequest("admin/unapproved-drivers", data);
export const getAdminDriverDetail = (id) => postRequest("admin/driver-detail", { id });
export const getInactiveAdminDrivers = (data) => postRequest("admin/get-unactive-drivers", data);
export const deleteDriver = (id) => API.get(`admin/deleteDriver/${id}`);

// Garage APIs
export const getAllAdminGarage = (data) => postRequest("admin/grages", data);
export const getApproveAdminGarage = (data) => postRequest("admin/approved-grages", data);
export const getUnapproveAdminGarage = (data) => postRequest("admin/unapproved-grages", data);
export const getAdminGarageDetail = (id) => postRequest("admin/garages-detail", { id });
export const getInactiveGarages = (data) => postRequest("admin/get-unactive-grages", data);

// Active/Block APIs
export const activeBlock = (id) => postRequest("admin/active-block", { id });

// Settings APIs
export const getSettings = () => API.get("admin/get-settings");
export const updateSettings = (data) => postRequest("admin/update-settings", data);

// Invoice API
export const addAdminInvoice = (data) => postRequest("admin/add-invoice", data);
export const adminInvoice = (data) => postRequest("admin/get-invoices-user", data);
export const adminInvoiceStatus = (data) => postRequest("admin/invoice-status", data);


// Vehicle APIs
export const getAdminVehicles = (data) => postRequest("admin/all-cars", data);
export const adminReleaseVehicle = (data) => postRequest("admin/release-car", data);

//Bypass Verification API
export const bypassVerification = (data) => postRequest("admin/bypass-verification", data);

//Import Cars API
export const importCars = (data) => postRequest("admin/import-cars", data);
