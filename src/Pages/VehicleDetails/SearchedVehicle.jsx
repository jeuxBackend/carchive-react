import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InfoCard from './VehicleComponents/InfoCard'
import DriversCard from './VehicleComponents/DriversCard'
import Specification from './VehicleComponents/Specification'
import Services from './VehicleComponents/Services'
import BlueButton from '../../Components/Buttons/BlueButton'
import { getVehicleById } from '../../API/portalServices'
import { BeatLoader } from 'react-spinners'
import AddDriver from './VehicleComponents/AddDriver'
import { useGlobalContext } from '../../Contexts/GlobalContext'
import { useTheme } from '../../Contexts/ThemeContext'
import TransferModal from './TransferModal'

function SearchedVehicle() {
    const { id } = useParams()
    const [vehicleDetail, setVehicleDetail] = useState({})
    const { vehicleData, setVehicleData } = useGlobalContext()
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { theme } = useTheme()

    return (
        <>
        <TransferModal open={open} setOpen={setOpen}/>
            {loading ? <div className="h-[80vh] flex items-center justify-center">
                <BeatLoader color="#2d9bff" />
            </div> :
                <div className='flex flex-col gap-3'>
                    <div className='grid lg:grid-cols-1 gap-4 h-full'>
                        <div className='w-full h-full'>
                            <InfoCard data={vehicleData} />
                        </div>

                    </div>
                    <div className='grid lg:grid-cols-1 gap-4 h-full'>
                        <div className='w-full h-full'>
                            <Specification data={vehicleData} />
                            <div className='grid grid-cols-1 gap-5 my-4'>

                                <div

                                    onClick={() => setOpen(true)}
                                    className={`w-full py-3 px-3 xl:text-[1rem] cursor-pointer lg:text-[0.6rem] text-center 2xl:px-4 flex justify-center items-center rounded-xl focus:outline-none ${theme === "dark" ? "bg-[#479cff] text-white" : "bg-[#1b1c1e] text-white "
                                        }`}
                                >
                                    Buy Car

                                </div>
                            </div>
                        </div>

                    </div>
                </div>}
        </>
    )
}

export default SearchedVehicle