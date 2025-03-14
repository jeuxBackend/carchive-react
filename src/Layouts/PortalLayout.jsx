import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../Components/Sidebar/Sidebar';
import { useTheme } from '../Contexts/ThemeContext';
import Topbar from '../Components/Topbar/Topbar';
import Logout from '../Components/Logout/Logout';
// import Logout from '../../Components/Logout/Logout'


function Layout() {
    const [side, setSide] = useState(false)
    const [logout, setLogout] = useState(false)
    const navigate = useNavigate();
    const { theme } = useTheme();
    const portalToken = localStorage.getItem("CarchivePortalToken");
    const adminToken = localStorage.getItem("CarchiveAdminToken");

    if (adminToken) {
        return <Navigate to="/Admin/Dashboard" />; 
      }

    return (
        <div>
            {portalToken ?
        <>
            <Logout logout={logout} setLogout={setLogout} />
            <div className={`flex h-screen  relative lg:p-3 transition-all ${theme === "dark" ? "bg-[#1b1c1e]" : "bg-white"} overflow-hidden`}>
                <Sidebar side={side} setSide={setSide} setLogout={setLogout} />
                <div className='w-full lg:w-[80%] px-8 py-4 h-full overflow-auto'>
                    <Topbar side={side} setSide={setSide} />
                    <div onClick={() => setSide(false)}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>:
        <Navigate to="/" />
        }
        </div>
    )
}

export default Layout