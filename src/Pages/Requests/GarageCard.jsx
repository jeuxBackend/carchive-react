import React, { useState } from 'react'
import { useTheme } from '../../Contexts/ThemeContext'
import GradientButton from '../../Components/Buttons/GradientButton'
import RequestButton from '../../Components/Buttons/RequestButton'
import { motion } from 'framer-motion'
import { changeGarageStatus } from '../../API/portalServices'
import { toast } from 'react-toastify'

function GarageCard({ data, fetchRequestsData }) {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const requestStatus = async (id, status) => {
    setLoading(true)
    try {
      const response = await changeGarageStatus({ id, status })
      if (response.data) {
        toast.success("Status Changed Successfully")
        fetchRequestsData()
      }
    } catch (error) {
      console.error(error.response)
      toast.error(error.response.data.message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl shadow-lg transition-all
            ${theme === "dark" ? "bg-[#323335] border-2 border-[#323335]" : "bg-white border-2 border-[#ECECEC]"}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="h-[200px] relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${data?.garage?.image})` }}
      >
        <div className="bg-gradient-to-b from-transparent to-black/80 w-full h-full absolute rounded-xl top-0" />
        <p className='text-[1.4rem] font-medium bottom-3 absolute left-3 text-white'>{data?.garage?.name}</p>
      </motion.div>
      <div className='pt-2 flex justify-between'>
          <p className='fontbold text-lg text-[#323335]'>Email:</p>
         <p className='text-[#7B7B7B]'>{data?.garage?.email}</p> 
      </div>
      <div className='pt-2 flex justify-between'>
          <p className='fontbold text-lg text-[#323335]'>Phone:</p>
         <p className='text-[#7B7B7B]'>{data?.garage?.phNumber}</p> 
      </div>
      <div className='pt-2 flex justify-between'>
          <p className='fontbold text-lg text-[#323335]'>City:</p>
         <p className='text-[#7B7B7B]'>{data?.garage?.city}</p> 
      </div>
      <div className='pt-2 flex justify-between'>
          <p className='fontbold text-lg text-[#323335]'>ZipCode:</p>
         <p className='text-[#7B7B7B]'>{data?.garage?.zipCode}</p> 
      </div>
      <div className='pt-2 flex justify-between'>
          <p className='fontbold text-lg text-[#323335]'>Street:</p>
         <p className='text-[#7B7B7B]'>{data?.garage?.street}</p> 
      </div>
      <div className='pt-2 flex justify-between'>
          <p className='fontbold text-lg text-[#323335]'>House No:</p>
         <p className='text-[#7B7B7B]'>{data?.garage?.houseNum}</p> 
      </div>
      <div className="mt-2 flex gap-4 sm:flex-row flex-col">

        <GradientButton name='Reject' handleClick={() => requestStatus(data?.id, "4")} loading={loading} />

        <RequestButton name="Accept" handleClick={() => requestStatus(data?.id, "2")} loading={loading} />

      </div>
    </motion.div>
  )
}

export default GarageCard
