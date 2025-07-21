import React, { useCallback, useEffect, useState } from 'react'
import LogCard from './LogCard'
import { motion } from 'framer-motion'
import { getLogs } from '../../API/portalServices';
import { useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import NoDataFound from '../../GlobalComponents/NoDataFound/NoDataFound';

function ViewLogs() {
  const [loading, setLoading] = useState(false);
  const [logsData, setLogsData] = useState({})
  const { id } = useParams();

  const fetchLogsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getLogs(id);
      setLogsData(response?.data?.data || {});
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogsData();
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {loading ? <div className="h-[80vh] flex items-center justify-center">
        <BeatLoader color="#2d9bff" />
      </div> : (logsData.length > 0 ? (
        <div className='grid grid-cols-1 lg:grid-cols-1 2xl:grid-cols-2  gap-4'>
          {logsData.map((data, index) => (
            <LogCard data={data} key={index} />))}

        </div>) : <div className="h-[80vh] flex items-center justify-center"><NoDataFound /></div>)}

    </motion.div>
  )
}

export default ViewLogs