import React, { useState } from 'react'
import { useTheme } from '../../Contexts/ThemeContext'
import GradientButton from '../../Components/Buttons/GradientButton'
import RequestButton from '../../Components/Buttons/RequestButton'
import { motion } from 'framer-motion'
import { changeGarageStatus } from '../../API/portalServices'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next';
import GarageRequestModal from './Modals/GarageRequestModal'


function GarageCard({ data, fetchRequestsData }) {
  const { t } = useTranslation();
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false);
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
    <>
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


        <div className={`pt-2 flex justify-between ${theme === "dark" ? "text-white" : ""}`}>
          <p className='fontbold text-lg'>{t('email')}</p>
          <p className={theme === "dark" ? "text-gray-300" : "text-[#7B7B7B]"}>{data?.garage?.email}</p>
        </div>
        <div className={`pt-2 flex justify-between ${theme === "dark" ? "text-white" : ""}`}>
          <p className='fontbold text-lg'>{t('phone')}</p>
          <p className={theme === "dark" ? "text-gray-300" : "text-[#7B7B7B]"}>{data?.garage?.phNumber}</p>
        </div>
        <div className={`pt-2 flex justify-between ${theme === "dark" ? "text-white" : ""}`}>
          <p className='fontbold text-lg'>{t('city')}</p>
          <p className={theme === "dark" ? "text-gray-300" : "text-[#7B7B7B]"}>{data?.garage?.city}</p>
        </div>
        <div className={`pt-2 flex justify-between ${theme === "dark" ? "text-white" : ""}`}>
          <p className='fontbold text-lg'>{t('zipcode')}</p>
          <p className={theme === "dark" ? "text-gray-300" : "text-[#7B7B7B]"}>{data?.garage?.zipCode}</p>
        </div>
        <div className={`pt-2 flex justify-between ${theme === "dark" ? "text-white" : ""}`}>
          <p className='fontbold text-lg'>{t('street')}</p>
          <p className={theme === "dark" ? "text-gray-300" : "text-[#7B7B7B]"}>{data?.garage?.street}</p>
        </div>
        <div className={`pt-2 flex justify-between ${theme === "dark" ? "text-white" : ""}`}>
          <p className='fontbold text-lg'>{t('house_no')}</p>
          <p className={theme === "dark" ? "text-gray-300" : "text-[#7B7B7B]"}>{data?.garage?.houseNum}</p>
        </div>
        <div 
  className={`py-2 flex justify-end font-bold cursor-pointer hover:underline ${theme === "dark" ? "text-blue-500" : "text-blue-600"}`}
  onClick={() => setShowModal(true)}
> 
  {t("View Details")}
</div>
        <div className="mt-2 flex gap-4 sm:flex-row flex-col">
          <GradientButton name={t('reject')} handleClick={() => requestStatus(data?.id, "4")} loading={loading} />
          <RequestButton name={t('accept')} handleClick={() => requestStatus(data?.id, "2")} loading={loading} />
        </div>
      </motion.div>
      {showModal && (
        <GarageRequestModal
          setOpen={setShowModal}
          garageData={data}
        />
      )}
    </>
  )
}

export default GarageCard