import API from "./portalAPI";

// AUTH API's
export const portalLogin = (credentials) => API.post("/login", credentials);
export const portalRegistration = (data) => API.post("/registerCompany", data);
export const portalForgot = (data) => API.post("/forgot", data);

// Dashboard API's
export const getDashboard = () => API.get("/portal/portal-dashboard");

// Invoices API's
export const getInvoices = () => API.get("/portal/get-invoices");

// Settings API's
export const getSettings = () => API.get("/getSettings");

