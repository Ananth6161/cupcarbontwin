import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import {Icon} from 'leaflet';
//import { Client } from '@elastic/elasticsearch';

const IIITHLocation = () => {
  const [markers, setMarkers] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  // useEffect(() => {
  //   // Initialize Elasticsearch client
  //   const elasticClient = new Client({ 
  //     node: process.env.ELASTICSEARCH_URL,
  //     auth:{
  //         username: process.env.USERNAME, // Replace with your Elasticsearch username
  //         password: process.env.PASSWORD, // Replace with your Elasticsearch password
  //     }, }); // Adjust the Elasticsearch server URL as needed

  //   // Define your Elasticsearch query to fetch data
  //   const query = {
  //     index: 'sensorsamplefinal', // Replace with your Elasticsearch index name
  //     body: {
  //       query: {
  //         // Your Elasticsearch query here
  //         // Example: match_all to fetch all documents
  //         match_all: {},
  //       },
  //     },
  //   };

  //   // Fetch data from Elasticsearch
  //   elasticClient
  //       .search(query)
  //       .then((response) => {
  //           const hits = response.body.hits.hits;
  //           const data = hits.map((hit) => {
  //               const coordinates = hit._source.Coordinates; // Assuming 'Coordinates' is in the format "lat,lon"
  //               const [lat, lon] = coordinates.split(',').map(parseFloat);
  //               return {
  //                   id: hit._id,
  //                   position: [lat, lon], // Store position as an array
  //                   name: hit._source.node_id,
  //                   // Add more properties as needed
  //               };
  //           });
  //           setMarkers(data);
  //       })
  //       .catch((error) => {
  //           console.error('Error fetching data from Elasticsearch:', error);
  //       });
  // }, []);
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
  console.log(markers);
  return (
    <div>
      <button onClick={addMarker}>Add Marker</button>
      <MapContainer center={[17.4474, 78.3491]} zoom={13} style={{ height: '1000px', width: '100%' }} onClick={handleMapClick}>
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