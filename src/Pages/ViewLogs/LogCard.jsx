import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { GoogleMap, useLoadScript, Marker, Polyline } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { DirectionsService, DirectionsRenderer } from '@react-google-maps/api';



const mapContainerStyle = {
  width: '100%',
  height: '250px',
};


const LogCard = ({ data }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [directions, setDirections] = useState(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAXD1Odr8R1DL8py6W29ZeImPO-kQdIAdg',
    version: "3.55",
    preventGoogleFontsLoading: true,
  });

  function formatTime(timeString) {
    
     if (timeString === null || timeString === undefined) {
    return '';
  }

    if (typeof timeString === 'string' && timeString.includes(':')) {
      return timeString;
    }

    if (!isNaN(Number(timeString))) {
      const date = new Date(Number(timeString));
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} `;
    }

    return timeString || 'N/A';
  }

  const startCoords = data?.lat_long_start?.split(',').map(Number);
  const endCoords = data?.lat_long_end?.split(',').map(Number);

  const startPosition = startCoords && startCoords.length === 2 ? {
    lat: startCoords[0],
    lng: startCoords[1]
  } : null;

  // Check if end coordinates are "0,0" or 0
  const isCarUnassigned = data?.lat_long_end === "0,0" ||
    data?.lat_long_end === "0" ||
    data?.lat_long_end === 0 ||
    (endCoords && endCoords.length === 2 && endCoords[0] === 0 && endCoords[1] === 0);

  const endPosition = endCoords && endCoords.length === 2 && !isNaN(endCoords[0]) && !isNaN(endCoords[1]) && !isCarUnassigned ? {
    lat: endCoords[0],
    lng: endCoords[1]
  } : null;

  const path = startPosition && endPosition ? [
    startPosition,
    endPosition
  ] : null;

  const hasValidCoordinates = startCoords && startCoords.length === 2 && !isNaN(startCoords[0]) && !isNaN(startCoords[1]);

  if (loadError) {
    console.error('Error loading Google Maps:', loadError);
  }

  const mapOptions = {
    zoom: 15,
    center: startPosition,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    mapId: 'DEMO_MAP_ID',
  };

  // Polyline options
  const polylineOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 3,
  };

  return (
    <motion.div
      className={`rounded-xl w-[100%] p-5 shadow-lg ${theme === "dark" ? "bg-[#323335] border-[#323335]" : "bg-white border-[#ECECEC] border"
        }`}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full flex items-center justify-center">
        <p className={`text-[1.3rem] font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{t('view_logs')}</p>
      </div>

      <div className="flex lg:items-center justify-between gap-3 lg:flex-row flex-col">
        <div className="flex flex-col gap-3 mt-5">
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">{t('start_time')}</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{formatTime(data?.start_time)}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">{t('end_time')}</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{formatTime(data?.end_time)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:mt-5">
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">{t('start_mileage')}</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{data?.start_mileage}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">{t('end_mileage')}</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{data?.end_mileage}</p>
          </div>
        </div>

      </div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-2">
        {/* Start Coordinates */}
        <div className="flex flex-col">
          <p className="text-[#777e90] font-medium">{t('Start_Coordinates')}:</p>
          {data?.lat_long_start ? (
            <div className="flex gap-2">
              <p className={theme === "dark" ? "text-white" : "text-black"}>
                Lat: {data.lat_long_start.split(',')[0]}
              </p>
              <p className={theme === "dark" ? "text-white" : "text-black"}>
                Long: {data.lat_long_start.split(',')[1]}
              </p>
            </div>
          ) : (
            <p className={theme === "dark" ? "text-white" : "text-black"}>N/A</p>
          )}
        </div>

        {/* Driver Name */}
        <div className="flex flex-col mr-7">
          <p className="text-[#777e90] font-medium">{t('driver_name') || 'Driver Name'}:</p>
          <p className={theme === "dark" ? "text-white" : "text-black"}>
            {data?.driverName || 'N/A'}
          </p>
        </div>
      </div>


      <div className="flex items-center gap-1 mt-2">
        <p className="text-[#777e90] font-medium">{t('total_distance_driven')}</p>
        <p className={theme === "dark" ? "text-white" : "text-black"}>{data?.total_distance}</p>
      </div>

      {/* Show Car Unassigned message if end coordinates are 0,0 or 0 */}
      {isCarUnassigned && (
        <div className="mt-4 p-3 rounded-lg bg-orange-100 border border-orange-200">
          <p className="text-orange-800 font-medium text-center">
            {t('car_unassigned') || 'Car Unassigned'}
          </p>
        </div>
      )}

      {hasValidCoordinates && isLoaded && !isCarUnassigned && (
        <div className="mt-2">
          <p className="text-[#777e90] font-medium mb-2">{t('map')}</p>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            options={mapOptions}
          >
            {startPosition && endPosition && !directions && (
              <DirectionsService
                options={{
                  origin: startPosition,
                  destination: endPosition,
                  travelMode: window.google.maps.TravelMode.DRIVING,
                }}
                callback={(result, status) => {
                  if (status === 'OK') {
                    setDirections(result);
                  } else {
                    console.error('Directions request failed:', status);
                  }
                }}
              />
            )}

            {directions && (
              <DirectionsRenderer
                options={{
                  directions,
                  suppressMarkers: false,
                  polylineOptions: {
                    strokeColor: '#FF0000',
                    strokeOpacity: 1,
                    strokeWeight: 3,
                  }
                }}
              />
            )}

          </GoogleMap>
        </div>
      )}

      {hasValidCoordinates && !isLoaded && !isCarUnassigned && (
        <div className="mt-2">
          <p className="text-[#777e90] font-medium mb-2">{t('loading_map')}</p>
        </div>
      )}
    </motion.div>
  );
};

export default LogCard;