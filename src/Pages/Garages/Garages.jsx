import React, { useCallback, useEffect, useState } from 'react'
import { getGarages } from '../../API/portalServices';
import { useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import NoDataFound from '../../GlobalComponents/NoDataFound/NoDataFound';
import GarageCard from './GarageCard';

function Garages() {

    const [loading, setLoading] = useState(false);
    const {id} = useParams()
    const [garages, setGarages] = useState([])
   

    const fetchGaragesData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getGarages(id);
            console.log(response)
            setGarages(response?.data?.data || []);
         
        } catch (error) {
            console.error("Error fetching vehicle data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGaragesData();
    }, [id]);

    return (
        <div>{loading?<div className="h-[80vh] flex items-center justify-center">
            <BeatLoader color="#2d9bff"/>
          </div>:(
            garages.length > 0 ? (
                <div className='grid lg:grid-cols-2 xl:grid-cols-3  gap-4'>
                  {garages.map((data, index) => (
                    <GarageCard data={data} key={index} />))}
        
                </div>) : <div className="h-[80vh] flex items-center justify-center"><NoDataFound /></div>)}

        
          </div>
    )
}

export default Garages