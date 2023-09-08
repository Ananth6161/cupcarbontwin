import React, { useState } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { Icon } from 'leaflet';

// const customIcon = new Icon({
//   iconUrl: 'icon.png',
//   // iconSize: [32, 32], // Adjust the size of the icon as needed
//   // iconAnchor: [16, 32], // Position the icon anchor point (usually at the bottom center)
//   // popupAnchor: [0, -32], // Position the popup anchor point (above the icon)
// });

//import { useNavigate } from 'react-router-dom';

const IIITHLocation = () => {
  const [markers, setMarkers] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  

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
          <Marker key={marker.id} position={marker.position} draggable={true} eventHandlers={{
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

// src/components/IIITHLocation.js
// import React from 'react';
// import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { useNavigate } from 'react-router-dom';

// const IIITHLocation = () => {
//   const iiithCoordinates = [17.4474, 78.3491]; // IIITH coordinates in Gachibowli
//   const navigate = useNavigate(); // Initialize the useNavigate hook

// //   const handleMarkerClick = () => {
// //     // Use navigate to navigate to the dashboard route
// //     navigate('/dashboard');
// //   };
//   return (
//     <MapContainer center={iiithCoordinates} zoom={40} style={{ height: '1000px', width: '100%' }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={[17.444,78.347]} eventHandlers={{
//          click: (e) => {
//            navigate('/dashboard');
//          },
//         }}>
//         <Popup>Click to go to dashboard</Popup>
//       </Marker>
//     </MapContainer>
//   );
// };

// export default IIITHLocation;