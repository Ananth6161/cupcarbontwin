import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import {Icon} from 'leaflet';
import axios from "axios";
import SensorPopup from './SensorPopup';
import Pipe from './pipe';
import DynamicPipes from './DynamicPipes'; 

const IIITHLocation = () => {
  const [markers, setMarkers] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const indexname = "finaltempdata1";
        const response = await axios.get('http://localhost:4000/latestdata', { params: { indexname } });
        const data = response.data;
        const markersData = data.map((hit) => {
          const coordinates = hit.latest_data.location;
          const [lat, lon] = coordinates.split(',').map(parseFloat);
          return {
            id: hit.sensor_id,
            position: [lat, lon],
            flowrate: hit.latest_data.flowrate,
            totalflow: hit.latest_data.totalflow,
            pressure: hit.latest_data.pressure,
            pressurevoltage: hit.latest_data.pressurevoltage,
          };
        });
        setMarkers(markersData);
      } catch (error) {
        console.error('Error fetching data from Elasticsearch:', error);
      }
    };

    // Fetch data initially when the component mounts
    fetchData();

    // Set up an interval to fetch data every, for example, 10 seconds (adjust as needed)
    const intervalId = setInterval(() => {
      fetchData();
    }, 10000); // 10 seconds in milliseconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  const addMarker = () => {
    // Generate a unique ID for the new marker
    const markerId = markers.length + 1;
  
    // Create a new marker object with an initial position
    const newMarker = {
      //timestamp: "2021-05-01T00:00:00.000Z",
      id: markerId,
      position: [17.4474, 78.3491], // Initial position, you can change this
      value1: 0,
      value2: 0,
      value3: 0,
      value4: 0,
      value5: 0,
      value6: 0
    };
  
    // Add the new marker to the markers array
    setMarkers([...markers, newMarker]);
  
    // Enable marker placement mode
    setIsAddingMarker(true);
  };
  
  const handleMapClick = (e) => {
    if (isAddingMarker) {
      setNewMarkerPosition(e.latlng);
      console.log(e.latlng);
      setIsAddingMarker(false);
    }
    else {

    }
  };

  const handleMarkerClick = (sensor) => {
    console.log("Marker clicked:", sensor); // Add this line
    setSelectedSensor(sensor);
  };
  const dynamicPipeSize = 40;
  const pipeData = [
    [[17.4474, 78.3491], [17.4474, 78.3481], [17.448, 78.3475]], // Example pipe coordinates
    // Add more pipe coordinates as needed
  ];
  
  return (
    <div>
      <button onClick={addMarker}>Add Marker</button>
      <MapContainer center={[17.4474, 78.3491]} zoom={18} style={{ height: '1000px', width: '100%' }} onClick = {handleMapClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {pipeData.map((pipe) => (
          <Pipe points={pipe} color="blue" />
        ))}

        {markers.map((marker) => {
          console.log("Rendering marker:", marker); // Add this line
          return (
            // Within the MapContainer component in IIITHLocation.js

            <Marker
              position={marker.position}
              draggable={true}
              icon={new Icon({
                iconUrl: markerIconPng,
                iconSize: [25, 41],
                iconAnchor: [12, 41]
              })}
              onClick={() => handleMarkerClick(marker)}
              eventHandlers={{
                dragend: (e) => {
                  const updatedPosition = e.target.getLatLng(); // Get the updated position
                  const updatedMarkers = markers.map((m) => {
                    if (m.id === marker.id) {
                      return { ...m, position: [updatedPosition.lat, updatedPosition.lng] };
                    }
                    return m;
                  });
                  setMarkers(updatedMarkers); // Update the markers array with the new position
                }
              }}
            >
              <Popup>
                <SensorPopup markers={markers.filter((m) => m.id === marker.id)} />
              </Popup>
            </Marker>
            
          );
        })}

        {selectedSensor && (
          <Marker position={selectedSensor.position}>
            <Popup>
              <SensorPopup markers={markers.filter((m) => m.position[0] === selectedSensor.position[0] && m.position[1] === selectedSensor.position[1])} />
            </Popup>
          </Marker>
        )}
        {isAddingMarker && newMarkerPosition && (
          <Marker
            position={newMarkerPosition}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                // Handle the added marker's drag and update its position
                setNewMarkerPosition(e.target.getLatLng());
              },
            }}
          >
            <Popup>Drag and place this marker</Popup>
          </Marker>
          // datasimulation(markers[markers.length -1]);
        )}
      </MapContainer>
    </div>
  );
};

export default IIITHLocation;