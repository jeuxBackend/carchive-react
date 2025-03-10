import React from 'react'
import { useParams } from 'react-router-dom'
import InfoCard from './VehicleComponents/InfoCard'
import DriversCard from './VehicleComponents/DriversCard'
import Specification from './VehicleComponents/Specification'
import Services from './VehicleComponents/Services'
import BlueButton from '../../Components/Buttons/BlueButton'

function VehicleDetails() {
  const { id } = useParams()
  return (
    <div className='flex flex-col gap-3'>
      <div className='grid lg:grid-cols-2 gap-4 h-full'>
        <div className='w-full h-full'>
          <InfoCard />
        </div>
        <div className='w-full  h-full'>
          <DriversCard />
        </div>
      </div>
      <div className='grid lg:grid-cols-2 gap-4 h-full'>
        <div className='w-full h-full'>
          <Specification />
          <div className='grid grid-cols-2 gap-5 my-4'>
            <BlueButton name='Release Vehicle'/>
            <BlueButton name='View Logs'/>
          </div>
        </div>
        <div className='w-full  h-full'>
          <Services />
          <div className='grid grid-cols-2 gap-5 my-4'>
            <BlueButton name='View Garages'/>
            <BlueButton name='View Requests'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetails