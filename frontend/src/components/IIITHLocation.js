import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import {Icon} from 'leaflet';
import axios from "axios";
//import { Client } from '@elastic/elasticsearch';

const IIITHLocation = () => {
  const [markers, setMarkers] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  useEffect( () => {
    //   // Define your Elasticsearch query to fetch data
    
    const query = {
      index: 'sensordata', // Replace with your Elasticsearch index name
      body: {
        "query": {
          "match_all": {},
        },
      },
    };
    
      
    axios.get('http://localhost:4000/elasticsearch/sensorsamplefinals/_search', query)

    .then((response) => {
      const hits = response.data.hits.hits; // Access the hits array within the response
      console.log('Elasticsearch data:', hits);
      const data = hits.map((hit) => {
        const coordinates = hit._source.Coordinates; // Assuming 'Coordinates' is in the format "lat,lon"
        const [lat, lon] = coordinates.split(',').map(parseFloat);
        return {
          id: hit._id,
          position: [lat, lon], // Store position as an array
          // Add more properties as needed
        };
      });
      setMarkers(data);
      console.log(data)
      console.log(markers)
    })
    .catch((error) => {
      console.error('Error fetching data from Elasticsearch:', error);
    });
  }, []);
  const addMarker = () => {
    // Generate a unique ID for the new marker
    const markerId = markers.length + 1;
  
    // Create a new marker object with an initial position
    const newMarker = {
      id: markerId,
      position: [17.4474, 78.3491], // Initial position, you can change this
    };
  
    // Add the new marker to the markers array
    setMarkers([...markers, newMarker]);
  
    // Enable marker placement mode
    setIsAddingMarker(true);
  };
  

  const handleMapClick = (e) => {
    if (isAddingMarker) {
      setNewMarkerPosition(e.latlng);
      setIsAddingMarker(false);
    }
  };
  
  return (
    <div>
      <button onClick={addMarker}>Add Marker</button>
      <MapContainer center={[17.4474, 78.3491]} zoom={18} style={{ height: '1000px', width: '100%' }} onClick={handleMapClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} draggable={true} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} eventHandlers={{
            dragend: (e) => {
              // Handle marker drag and update its position
              const updatedMarkers = markers.map((m) =>
                m.id === marker.id ? { ...m, position: e.target.getLatLng() } : m
              );
              setMarkers(updatedMarkers);
            },
          }}>
            {/* <Popup>Marker</Popup> */}
          </Marker>
        ))}
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
        )}
      </MapContainer>
    </div>
  );
};

export default IIITHLocation;