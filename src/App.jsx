import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Auth/Login'
import Layout from './Layouts/PortalLayout'
import Settings from './Pages/Settings/Settings'
import Dashboard from './Pages/Dashboard/Dashboard'
import Vehicles from './Pages/Vehicles/Vehicles'
import VehicleDetails from './Pages/VehicleDetails/VehicleDetails'
import Chat from './Pages/Chat/Chat'
import Invoices from './Pages/Invoices/Invoices'
import Drivers from './Pages/Drivers/Drivers'
import Signup from './Pages/Auth/Signup'
import Requests from './Pages/Requests/Requests'
import Language from './Pages/Language/Language'
import About from './Pages/AboutUs/About'
import UpdateProfile from './Pages/UpdateProfile/UpdateProfile'
import AddVehicle from './Pages/AddVehicle/AddVehicle'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/Signup' element={<Signup/>} />
      <Route element={<Layout/>}>
        <Route path='/Dashboard' element={<Dashboard/>} />
        <Route path='/Vehicles' element={<Vehicles/>} />
        <Route path='/Vehicles/:id' element={<VehicleDetails/>}/>
        <Route path='/Invoices' element={<Invoices/>}/>
        <Route path='/Drivers' element={<Drivers/>}/>
        <Route path='/Requests' element={<Requests/>}/>
        <Route path='/Chat' element={<Chat/>}/>
        <Route path='/Settings' element={<Settings/>} />
        <Route path='/Language' element={<Language/>} />
        <Route path='/About' element={<About/>} />
        <Route path='/Privacy-Policy' element={<About/>} />
        <Route path='/Update-Profile' element={<UpdateProfile/>} />
        <Route path='/Add-Vehicle' element={<AddVehicle/>} />
      </Route>
    </Routes>
  )
}

export default App