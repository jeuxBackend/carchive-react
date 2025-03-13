import API from "./axiosInstance";

// // Admin Authentication API
export const adminLogin = (credentials) => API.post("login", credentials);

// Dashboard APIs
export const getAdminDashboard = () => API.get("admin/dashboard");

// all company APIs
export const getAdminCompanies = (data) => API.post("admin/all-companies", data);

// approve company APIs
export const getApproveAdminCompanies = (data) => API.post("admin/approved-companies", data);

// unapprove company APIs
export const getUnapproveAdminCompanies = (data) => API.post("admin/unapproved-companies", data);

// all drivers APIs
export const getAllAdminDrivers = (data) => API.post("admin/drivers", data);

// approve drivers APIs
export const getApproveAdminDrivers = (data) => API.post("admin/approved-drivers", data);

// unapprove drivers APIs
export const getUnapproveAdminDrivers = (data) => API.post("admin/unapproved-drivers", data);

// active block
export const activeBlock = (id) => API.post(`admin/active-block`, {id});

// company detail
export const getAdminCompanyDetail = (id) => API.post(`admin/company-detail`, {id});

// driver detail
export const getAdminDriverDetail = (id) => API.post(`admin/driver-detail`, {id});

// all garages APIs
export const getAllAdminGarage = (data) => API.post("admin/grages", data);

// approve garages APIs
export const getApproveAdminGarage = (data) => API.post("admin/approved-grages", data);

// unapprove garages APIs
export const getUnapproveAdminGarage = (data) => API.post("admin/unapporoved-grages", data);

// garage detail
export const getAdminGarageDetail = (id) => API.post(`admin/grage-detail`, {id});

// Settings APIs
export const getSettings = () => API.get("admin/get-settings");
export const updateSettings = (data) => API.post("admin/update-settings", data);


export const addAdminInvoice = (data) => API.post("admin/add-invoice", data);