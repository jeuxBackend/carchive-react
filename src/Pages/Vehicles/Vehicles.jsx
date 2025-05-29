import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Dropdown from '../../Components/DropDown/Dropdown';
import Search from '../../Components/Search/Search';
import VehicleCard from '../../Components/VehicleCard/VehicleCard';
import { getVehicles } from '../../API/portalServices';
import { BeatLoader } from 'react-spinners';
import NoDataFound from '../../GlobalComponents/NoDataFound/NoDataFound';
import { useGlobalContext } from '../../Contexts/GlobalContext';
import TransferVehicle from './TransferVehicle';
import { useTranslation } from "react-i18next";


function Vehicles() {
    const [loading, setLoading] = useState(false);
    const [vehiclesData, setVehiclesData] = useState([]);
    const [search, setSearch] = useState('');
    const {addTransfer, setAddTransfer} = useGlobalContext()
    const [selectedValue, setSelectedValue] = useState("");
    const { t } = useTranslation();


    const fetchVehiclesData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getVehicles();
            setVehiclesData(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching vehicle data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehiclesData();
    }, []);

 
    const filteredVehicles = vehiclesData?.filter(vehicle => {
        const searchTerm = search?.toLowerCase();
        const matchesSearch = 
            vehicle?.make?.toLowerCase()?.includes(searchTerm) ||  
            vehicle?.vinNumber?.toLowerCase()?.includes(searchTerm) || 
            vehicle?.plateNumber?.toLowerCase()?.includes(searchTerm);
    
        if (selectedValue === "1") {
            return matchesSearch && vehicle?.isArchive === "1"; 
        } 
        
        if (selectedValue === "0") {
            return matchesSearch && vehicle?.isArchive !== "1"; 
        }
    
        return matchesSearch;
    });
    

    return (
        <div>
            <TransferVehicle open={addTransfer} setOpen={setAddTransfer}/>
            <div className='flex items-center justify-center gap-3 md:flex-row flex-col'>
                <div className='w-full md:w-[25%]'>
                    <Dropdown setValue={setSelectedValue}/>
                </div>
                <div className='w-full md:w-[75%]'>
                    <Search value={search} setValue={setSearch} />
                </div>
            </div>

            {loading ? (
                <div className="h-[80vh] flex items-center justify-center">
                    <BeatLoader color="#2d9bff" />
                </div>
            ) : (
                filteredVehicles?.length > 0 ? (
                    <motion.div
                        className='grid lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-5'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {filteredVehicles?.map((data, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <VehicleCard data={data} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="h-[80vh] flex items-center justify-center">
                        <NoDataFound />
                    </div>
                )
            )}
        </div>
    );
}

export default Vehicles;
