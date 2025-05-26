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
import Specs from './VehicleComponents/Specs'

function VehicleDetails() {
  const { id } = useParams()
  const [vehicleDetail, setVehicleDetail] = useState({})
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchVehicleData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getVehicleById(id);
      setVehicleDetail(response?.data?.car || {});
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicleData();
  }, [id]);
  return (
    <>
      <AddDriver open={open} setOpen={setOpen} fetchVehicleData={fetchVehicleData} />
      {loading ? <div className="h-[80vh] flex items-center justify-center">
        <BeatLoader color="#2d9bff" />
      </div> :
        <div className='flex flex-col gap-3'>
          <div className='grid lg:grid-cols-2 gap-4 h-full'>
            <div className='w-full h-full'>
              <InfoCard data={vehicleDetail} />
            </div>
            <div className='w-full h-full'>
              <DriversCard data={vehicleDetail} setOpen={setOpen} fetchVehicleData={fetchVehicleData} />
            </div>
          </div>
          <div className='grid lg:grid-cols-2 gap-4 h-full'>
            <div className='w-full h-full'>
              <Specs data={vehicleDetail} />
              <div className='grid grid-cols-1 gap-5 my-4'>

                <BlueButton name='View Logs' to={`/ViewLogs/${id}`} />
                <BlueButton name='Requests' to={`/VehicleRequests/${id}`} />
              </div>
            </div>
            <div className='w-full  h-full'>
              <Services data={vehicleDetail} setLoading={setLoading} />
              <div className='grid grid-cols-1 gap-5 my-4'>
                <BlueButton name='View Garages' to={`/VehicleGarages/${id}`} />

              </div>
            </div>
          </div>
        </div>}
    </>
  )
}

export default VehicleDetails