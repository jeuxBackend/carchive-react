import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import Layout from "./Layouts/PortalLayout";
import Settings from "./Pages/Settings/Settings";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Vehicles from "./Pages/Vehicles/Vehicles";
import VehicleDetails from "./Pages/VehicleDetails/VehicleDetails";
import Chat from "./Pages/Chat/Chat";
import Invoices from "./Pages/Invoices/Invoices";
import Drivers from "./Pages/Drivers/Drivers";
import Signup from "./Pages/Auth/Signup";
import Requests from "./Pages/Requests/Requests";
import Language from "./Pages/Language/Language";
import About from "./Pages/AboutUs/About";
import UpdateProfile from "./Pages/UpdateProfile/UpdateProfile";
import AddVehicle from "./Pages/AddVehicle/AddVehicle";
import AdminLogin from "./AdminPages/Auth/AdminLogin";
import AdminLayout from "./Layouts/AdminLayout";
import AdminDashboard from "./AdminPages/Dashboard/AdminDashboard";
import AdminCompany from "./AdminPages/Company/AdminCompany";
import AdminCompanyDetail from "./AdminPages/CompanyDetails/AdminCompanyDetail";
import AdminInvoices from "./AdminPages/Invoices/AdminInvoices";
import AdminDrivers from "./AdminPages/Drivers/AdminDrivers";
import AdminGarageOwners from "./AdminPages/GarageOwners/AdminGarageOwners";
import AdminSettings from "./AdminPages/Settings/AdminSettings";
import AdminAbout from "./AdminPages/AboutUs/AdminAbout";
import AdminPrivacy from "./AdminPages/PrivacyPolicy/AdminPrivacyPolicy";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import MaintenanceRecord from "./Pages/MaintenanceRecord/MaintenanceRecord";
import ViewLogs from "./Pages/ViewLogs/ViewLogs";
import Garages from "./Pages/Garages/Garages";
import SearchedVehicle from "./Pages/VehicleDetails/SearchedVehicle";
import TermsCondition from "./AdminPages/TermsCondition/TermsCondition";
import PublicPage from "./PublicPage/PublicPage";
import UpdateVehicle from "./Pages/UpdateVehicle/UpdateVehicle";

function App() {
  return (
    <>
      <Routes>
        <Route path="/PublicPage/:id" element={<PublicPage />} />
      </Routes>
      <Routes>
        <Route path="/Portal" element={<Navigate to="/" />} />
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        
        <Route element={<Layout />}>
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Vehicles" element={<Vehicles />} />
          <Route path="/Vehicles/:id" element={<VehicleDetails />} />
          <Route
            path="/VehicleMaintenence/:id"
            element={<MaintenanceRecord />}
          />
          <Route path="/ViewLogs/:id" element={<ViewLogs />} />
          <Route path="/VehicleGarages/:id" element={<Garages />} />
          <Route path="/SearchedVehicle" element={<SearchedVehicle />} />
          <Route path="/Invoices" element={<Invoices />} />
          <Route path="/Drivers" element={<Drivers />} />
          <Route path="/Requests" element={<Requests />} />
          <Route path="/Chat" element={<Chat />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Language" element={<Language />} />
          <Route path="/About" element={<About />} />
          <Route path="/Privacy-Policy" element={<PrivacyPolicy />} />
          <Route path="/Update-Profile" element={<UpdateProfile />} />
          <Route path="/Add-Vehicle" element={<AddVehicle />} />
          <Route path="/Update-Vehicle" element={<UpdateVehicle />} />
        </Route>
        <Route path="/Admin/Login" element={<AdminLogin />} />
        <Route path="/Admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="Companies" element={<AdminCompany />} />
          <Route path="Company/:id" element={<AdminCompanyDetail />} />
          <Route path="Invoices" element={<AdminInvoices />} />
          <Route path="Drivers" element={<AdminDrivers />} />
          <Route path="Garages" element={<AdminGarageOwners />} />
          <Route path="Settings" element={<AdminSettings />} />
          <Route path="About" element={<AdminAbout />} />
          <Route path="Privacy-Policy" element={<AdminPrivacy />} />
          <Route path="TermsCondition" element={<TermsCondition />} />
        </Route>
      </Routes>
      
    </>
  );
}

export default App;
