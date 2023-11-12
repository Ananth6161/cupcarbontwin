import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet';
import axios from "axios";
import SensorPopup from './SensorPopup';
import Pipe from './pipe';
import DynamicPipes from './DynamicPipes';

const IIITHLocation = () => {
  const [markers, setMarkers] = useState([]);
  // const [isAddingMarker, setIsAddingMarker] = useState(false);
  // const [newMarkerPosition, setNewMarkerPosition] = useState(null);
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
  //     console.log(e.latlng);
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
  const pipeData = [
    {
      id: 1,
      coordinates : [[17.445793, 78.351444], [17.445585517226135, 78.35123061528631], [17.446997987595438, 78.34955155849458], [17.447755394735346, 78.34861823145404], [17.447095222471898, 78.34800155182859], [17.447324, 78.347749]],
      sensors : ["WM-WF-PR00-70"]
    },// Example pipe coordinates
    // Add more pipe coordinates as needed
    {
      id: 2,
     coordinates : [[17.445793, 78.351444], [17.445585517226135, 78.35123061528631],[17.446997987595438, 78.34955155849458], [17.445570164227213, 78.34830200159946], [17.44636851845649, 78.34728828544641], [17.445073749898924, 78.34603336564616], [17.444881, 78.346202]],
     sensors : ["WM-WF-PL00-71"]//old boys hostel
    },
    {
      id : 3,
    coordinates : [[17.445793, 78.351444],[17.445585517226135, 78.35123061528631], [17.444730864986067, 78.35042595712052], [17.444925337105342, 78.3502379800931],
[17.444689923460846, 78.35000217802154], [17.444958, 78.349694], [17.445016, 78.349753], [17.445046, 78.349719], [17.445544, 78.349168], [17.445584, 78.348997]],
    sensors : ["WM-WF-KB04-70"]
    },
    {
      id : 4,
    coordinates : [[17.445793, 78.351444],[17.445585517226135, 78.35123061528631],[17.444730864986067, 78.35042595712052],[17.444925337105342, 78.3502379800931], [17.445191456511374, 78.3504960085306], [17.445237515599914, 78.35054377393108], [17.445482, 78.3503], [17.445518, 78.350403], [17.446348047878896, 78.34952430616724], [17.446267, 78.349436]],
    sensors : ["WM-WF-VN04-71"]
    },
    {
      id : 5,
    coordinates:[[17.445793, 78.351444],[17.445585517226135, 78.35123061528631],[17.444730864986067, 78.35042595712052], [17.443129, 78.348927], [17.443482144331, 78.34855901016505], [17.443299, 78.348365]],
    sensors : ["WM-WF-PH03-70"]
    },
    {
      id : 6,
    coordinates : [[17.445793, 78.351444],[17.445585517226135, 78.35123061528631],[17.444730864986067, 78.35042595712052],[17.444925337105342, 78.3502379800931],[17.445369, 78.349937]],
    sensors : ["WM-WF-VN01-00"]
    },

  ];

  function processSensorData(pipeData, latitude, longitude, markerData) {
    const thresholdDistance = 0.0001; // Adjust this threshold as needed
  
    // Initialize variables
    let pipeIds = [];
    let val = 0;
    let val2 = 0;
    let cnt = 0;
  
    // Check distance for each pipe
    for (const pipe of pipeData) {
      const coordinates = pipe.coordinates;
  
      for (let i = 0; i < coordinates.length - 1; i++) {
        const point1 = coordinates[i];
        const point2 = coordinates[i + 1];
  
        // Calculate perpendicular distance using the formula
        const distance = pointToLineDistance(latitude, longitude, point1[0], point1[1], point2[0], point2[1]);
  
        if (distance < thresholdDistance) {
          // If within threshold, add pipe ID to the list
          pipeIds.push(pipe.id);
  
          // Search for matching sensor in markerData
          const matchingSensor = markerData.find(sensor => sensor.id === pipe.sensors[0]);
  
          if (matchingSensor) {
            // Add data to variables
            val += matchingSensor.totalflow;
            val2 += matchingSensor.flowrate;
            cnt++;
          }
  
          break; // No need to check other points of the same pipe
        }
      }
    }
  
    if (pipeIds.length === 0) {
      // If no pipes are close, display an alert
      alert("Please select on the map.");
    }
  
    return { val, val2, cnt, pipeIds };
  }
  
  // Function to calculate perpendicular distance from a point to a line
  function pointToLineDistance(x, y, x1, y1, x2, y2) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
  
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    const param = dot / len_sq;
  
    let xx, yy;
  
    if (param < 0 || (x1 === x2 && y1 === y2)) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  return (
    <div>
      {/* <button onClick={addMarker}>Add Marker</button> */}
      <MapContainer center={[17.4474, 78.3491]} zoom={18} style={{ height: '1000px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {pipeData.map((pipe) => (
          <Pipe id = {pipe.id} points={pipe.coordinates} color="blue" />
        ))}

        {markers.map((marker) => {
          console.log("Rendering marker:", marker); // Add this line
          return (
            // Within the MapContainer component in IIITHLocation.js

            <Marker
              position={marker.position}
              draggable={false}
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