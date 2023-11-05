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
  // const [isAddingMarker, setIsAddingMarker] = useState(false);
  // const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  useEffect( () => {
    //   // Define your Elasticsearch query to fetch data
    
    const indexname = "finaltempdata1"
    
    axios.get('http://localhost:4000/latestdata', {indexname})

    .then((response) => {
      //const hits = response.data.hits.hits; // Access the hits array within the response
      //console.log('Elasticsearch data:', hits);
      const data = response.data; // Access the data property of the Axios response
      console.log(data[0]);
      const markersData = data.map((hit) => {
        const coordinates = hit.latest_data.location; // Assuming 'Coordinates' is in the format "lat,lon"
        const [lat, lon] = coordinates.split(',').map(parseFloat);
        return {
          id: hit.sensor_id,
          position: [lat, lon], // Store position as an array
          flowrate: hit.latest_data.flowrate,
          totalflow: hit.latest_data.totalflow,
          pressure: hit.latest_data.pressure,
          pressurevoltage: hit.latest_data.pressurevoltage,
        };
      });
      setMarkers(markersData);
      console.log(markersData)
      console.log(markers)
      return false;
    })
    .catch((error) => {
      console.error('Error fetching data from Elasticsearch:', error);
    });
  }, []);
  // const addMarker = () => {
  //   // Generate a unique ID for the new marker
  //   const markerId = markers.length + 1;
  
  //   // Create a new marker object with an initial position
  //   const newMarker = {
  //     //timestamp: "2021-05-01T00:00:00.000Z",
  //     id: markerId,
  //     position: [17.4474, 78.3491], // Initial position, you can change this
  //     value1: 0,
  //     value2: 0,
  //     value3: 0,
  //     value4: 0,
  //     value5: 0,
  //     value6: 0
  //   };
  
  //   // Add the new marker to the markers array
  //   setMarkers([...markers, newMarker]);
  
  //   // Enable marker placement mode
  //   setIsAddingMarker(true);
  // };
  
  // const handleMapClick = (e) => {
  //   if (isAddingMarker) {
  //     setNewMarkerPosition(e.latlng);
  //     setIsAddingMarker(false);
  //   }
  //   else {

  //   }
  // };

  const handleMarkerClick = (sensor) => {
    console.log("Marker clicked:", sensor); // Add this line
    setSelectedSensor(sensor);
  };
  const dynamicPipeSize = 40;
  const pipeCoordinates = [
    [[17.4474, 78.3491], [17.4474, 78.3481]], // Example pipe coordinates
    // Add more pipe coordinates as needed
  ];
  return (
    <div>
      {/* <button onClick={addMarker}>Add Marker</button> */}
      <MapContainer center={[17.4474, 78.3491]} zoom={18} style={{ height: '1000px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Pipe points = {pipeCoordinates} colour = "blue"/>

        {markers.map((marker) => {
          console.log("Rendering marker:", marker); // Add this line
          return (
            <Marker 
              key={marker.id} 
              position={marker.position} 
              draggable={false} 
              icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
              onClick={() => handleMarkerClick(marker)} 
            >
              <Popup>
                <SensorPopup markers={markers.filter((m) => m.position[0] === marker.position[0] && m.position[1] === marker.position[1])} />
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
        {/* {isAddingMarker && newMarkerPosition && (
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
        )} */}
      </MapContainer>
    </div>
  );
};

export default IIITHLocation;