import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../Contexts/ThemeContext';
import { GoogleMap, useLoadScript, Marker, Polyline } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '200px',
};

const LogCard = ({ data }) => {
  const { theme } = useTheme();

  // Load Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAXD1Odr8R1DL8py6W29ZeImPO-kQdIAdg',
    version: "3.55",
    preventGoogleFontsLoading: true,
  });

  function formatTime(timeString) {
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

  const endPosition = endCoords && endCoords.length === 2 && !isNaN(endCoords[0]) && !isNaN(endCoords[1]) ? {
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
        <p className={`text-[1.3rem] font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>View Logs</p>
      </div>

      <div className="flex lg:items-center justify-between gap-3 lg:flex-row flex-col">
        <div className="flex flex-col gap-3 mt-5">
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">Start Time:</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{formatTime(data?.start_time)}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">End Time:</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{formatTime(data?.end_time)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:mt-5">
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">Start Mileage:</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{data?.start_mileage}</p>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-[#777e90] font-medium">End Mileage:</p>
            <p className={theme === "dark" ? "text-white" : "text-black"}>{data?.end_mileage}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <p className="text-[#777e90] font-medium">Total distance driven:</p>
        <p className={theme === "dark" ? "text-white" : "text-black"}>{data?.total_distance}</p>
      </div>

      {hasValidCoordinates && isLoaded && (
        <div className="mt-2">
          <p className="text-[#777e90] font-medium mb-2">Map:</p>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            options={mapOptions}
          >
            {startPosition && (
              <Marker position={startPosition} />
            )}
            {endPosition && (
              <Marker position={endPosition} />
            )}
            {path && (
              <Polyline 
                path={path} 
                options={polylineOptions}
              />
            )}
          </GoogleMap>
        </div>
      )}

      {hasValidCoordinates && !isLoaded && (
        <div className="mt-2">
          <p className="text-[#777e90] font-medium mb-2">Loading map...</p>
        </div>
      )}
    </motion.div>
  );
};

export default LogCard;