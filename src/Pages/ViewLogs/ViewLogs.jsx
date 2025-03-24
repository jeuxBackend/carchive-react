import React, { useCallback, useEffect, useState } from 'react'
import LogCard from './LogCard'
import {motion} from 'framer-motion'
import { getLogs } from '../../API/portalServices';
import { useParams } from 'react-router-dom';

function ViewLogs() {
   const [loading, setLoading] = useState(false);
    const [logsData, setLogsData] = useState({})
    const {id} = useParams();
  
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
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        <LogCard logsData={logsData}/>

    </div>

</motion.div>
  )
}

export default ViewLogs