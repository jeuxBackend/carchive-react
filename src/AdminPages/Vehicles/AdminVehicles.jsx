import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Dropdown from '../../Components/DropDown/Dropdown';
import Search from '../../Components/Search/Search';
import VehicleCard from '../../Components/VehicleCard/VehicleCard';
import { getVehicles } from '../../API/portalServices';
import { BeatLoader } from 'react-spinners';
import NoDataFound from '../../GlobalComponents/NoDataFound/NoDataFound';
import { useGlobalContext } from '../../Contexts/GlobalContext';
import { getAdminVehicles } from '../../API/adminServices';
import Pagination from '../../AdminComponents/Pagination/Pagination';
import VehicleDetailsModal from './VehicleDetailsModal';

function AdminVehicles() {
    const [loading, setLoading] = useState(false);
    const [vehiclesData, setVehiclesData] = useState([]);
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(10);
    const [search, setSearch] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const { addTransfer, setAddTransfer } = useGlobalContext();
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (vehicleData) => {
        setSelectedVehicle(vehicleData);
        setIsModalOpen(true);
    };

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAdminVehicles({
                skip,
                take,
                search,
            });

    
            const vehicleData = response?.data?.data;
            const count = response?.data?.count;

          
            setVehiclesData(Array.isArray(vehicleData) ? vehicleData : []);
            setTotalCount(typeof count === 'number' ? count : Number(count) || 0);

        } catch (error) {
            console.error("Error fetching vehicle data:", error);
            setVehiclesData([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [skip, take, search]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const handlePageChange = (page) => {
        const pageNumber = Number(page);
        if (!isNaN(pageNumber) && pageNumber > 0) {
            setSkip((pageNumber - 1) * take);
        }
    };


    const safeSkip = Number(skip) || 0;
    const safeTake = Number(take) || 10;
    const safeTotalCount = Number(totalCount) || 0;

    const totalPages = Math.ceil(safeTotalCount / safeTake) || 1;
    const currentPage = Math.floor(safeSkip / safeTake) + 1;

    
    const filteredVehicles = Array.isArray(vehiclesData) ? vehiclesData : [];

    
   

    return (
        <div>
             <VehicleDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicleData={selectedVehicle}
        fetchVehicles={fetchVehicles}
      />
            <div className='flex items-center justify-center gap-3 md:flex-row flex-col'>
                <div className='w-full'>
                    <Search
                        value={search}
                        setValue={(value) => {
                            setSearch(String(value || ''));
                            setSkip(0);
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="h-[80vh] flex items-center justify-center">
                    <BeatLoader color="#2d9bff" />
                </div>
            ) : (
                filteredVehicles.length > 0 ? (
                    <motion.div
                        className='grid lg:grid-cols-2 xl:grid-cols-3 gap-3 mt-5'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {filteredVehicles.map((data, index) => {
                            
                            const uniqueKey = data?.id || data?.vinNumber || data?.registrationNumber || index;

                            return (
                                <motion.div
                                    key={uniqueKey}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <VehicleCard data={data}  navigable={false} onCardClick={() => handleViewDetails(data)}/>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <div className="h-[80vh] flex items-center justify-center">
                        <NoDataFound />
                    </div>
                )
            )}

            {filteredVehicles.length > 0 && safeTotalCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    setTake={(newTake) => {
                        const takeNumber = Number(newTake);
                        if (!isNaN(takeNumber) && takeNumber > 0) {
                            setTake(takeNumber);
                            setSkip(0);
                        }
                    }}
                    setSkip={(newSkip) => {
                        const skipNumber = Number(newSkip);
                        if (!isNaN(skipNumber) && skipNumber >= 0) {
                            setSkip(skipNumber);
                        }
                    }}
                    take={safeTake}
                    totalCount={safeTotalCount}
                />
            )}
        </div>
    );
}

export default AdminVehicles;