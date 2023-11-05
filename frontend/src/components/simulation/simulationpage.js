import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet';
import axios from "axios";
import SimulationSensorPopup from './SimulationSensorPopup';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const SimulationPageMain = () => {
  const { indexname: initialIndexName } = useParams(); // Use the indexname from useParams directly

  const [indexname, setIndexName] = useState(initialIndexName);
  const [sensorData, setSensorData] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [email, setEmail] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState(null);
  const [formData, setFormData] = useState({
    filename: initialIndexName,
  });
  var indextosend = indexname;
  useEffect(() => {
    const emailFromLocalStorage = localStorage.getItem('email');
    setEmail(emailFromLocalStorage);
  }, []);
  
  useEffect(() => {
    if(indexname === ":")
    {
      indextosend = "finaltempdata1";
    }
    console.log(indextosend);
    if(indextosend === "finaltempdata1")
    {
      axios.get('http://localhost:4000/latestdata', {
      params:{indexname: indextosend} })
      .then((response) => {
        const data = response.data;
        console.log(data[0]);
        const markersData = data.map((hit) => {
          const coordinates = hit.latest_data.location;
          const [lat, lon] = coordinates.split(',').map(parseFloat);
          return {
            id: hit.sensor_id,
            position: [lat, lon],
            flowrate: hit.latest_data.flowrate,
            totalflow: hit.latest_data.totalflow,
            pressure: hit.latest_data.pressure,
            pressurevoltage: hit.latest_data.pressurevoltage
          };
        });
        setSensorData(markersData);
      })
      .catch((error) => {
        console.error('Error fetching data from Elasticsearch:', error);
      });
    }
    else
    {
      axios.get('http://localhost:4000/latestdata', {
      params:{indexname: indextosend} })
      .then((response) => {
        const data = response.data;
        console.log(data[0]);
        const markersData = data.map((hit) => {
          const location = hit.latest_data.location;

      // Check if location is an object with lat and lon properties
      if (location && typeof location === 'object' && 'lat' in location && 'lon' in location) {
          const { lat, lon } = location;
          return {
            id: hit.sensor_id,
            position: [lat, lon],
            flowrate: hit.latest_data.flowrate,
            totalflow: hit.latest_data.totalflow,
            pressure: hit.latest_data.pressure,
            pressurevoltage: hit.latest_data.pressurevoltage
          };
        } else {
          // Handle the case where location is not in the expected format
          // You can log an error or take appropriate action
          return null; // or another default value
        }
        });
        setSensorData(markersData);
      })
      .catch((error) => {
        console.error('Error fetching data from Elasticsearch:', error);
      });
    }
  }, []);

  const addMarker = () => {
    const markerId = sensorData.length + 1;
    const newMarker = {
      id: markerId,
      position: [17.4474, 78.3491],
      flowrate: 0,
      totalflow: 0,
      pressure: 0,
      pressurevoltage: 0
    };
    setSensorData([...sensorData, newMarker]);
    setIsAddingMarker(true);
  };

  const handleMapClick = (e) => {
    if (isAddingMarker) {
      setNewMarkerPosition(e.latlng);
      setIsAddingMarker(false);
    }
  };

  const handleMarkerClick = (sensor) => {
    setSelectedSensor(sensor);
  };

  const handleSensorDataChange = (originalData, sensorId, newData) => {
    // // Find the index of the sensor in the array based on its ID
    // const sensorIndex = sensorData.findIndex((sensor) => sensor.id === sensorId);
  
    // if (sensorIndex !== -1) {
    //   // Create a copy of the sensor data array
    //   const updatedSensorData = [...sensorData];
      
    //   // Update the sensor's data
    //   updatedSensorData[sensorIndex] = newData;
  
    //   // Set the updated sensor data to the state
    //   setSensorData(updatedSensorData);
  
    //   // Now you have access to originalData, sensorId, and newData for further processing
    //   console.log("Sensor ID:", sensorId);
    //   console.log("Original Data:", originalData);
    //   console.log("New Data:", newData);
    // }
  };
  

  const handleFileNameChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  
  const handleSaveFile = (e) => {
    e.preventDefault();
    
    if (formData.filename.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Please enter a file name',
      });
    } else if (formData.filename === indexname) {
      // Handle the case where the filename is the same as the existing one (if needed)
    } else if (indexname === ":") {
      Swal.fire({
        title: "Confirmation",
        text: "You can't change the name of the file. Are you sure you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // User clicked "OK," proceed with the request
          console.log(formData.filename);
          axios.post('http://localhost:4000/simulation/userinfo', {
            email: email,
            filename: formData.filename 
          })
            .then((response) => {
              if (response.status === 200) {
                // Handle success
                setIndexName(formData.filename);
                Swal.fire({
                  icon: 'success',
                  title: 'File saved successfully, simulation starts now',
                });
              } else if (response.status === 400) {
                // Handle other status codes or conditions if needed
                Swal.fire({
                  icon: 'error',
                  title: 'Please choose another name for the file',
                });
              } else if (response.status === 500) {
                // Handle other status codes or conditions if needed
                Swal.fire({
                  icon: 'error',
                  title: 'Internal server error',
                });
              }
            })
            .catch((error) => {
              // Handle errors
              console.error('Error:', error);
            });
        }
      });
    } else {
      setFormData({ ...formData, filename: indexname }); // Fix the key 'filename'
      Swal.fire({
        icon: 'error',
        title: 'You cannot change the name of the file after creating it',
      });
    }
  };
  
  // const handleSaveData = () => {
  //   if (indexname === ":") {
  //     Swal.fire({
  //       title: "Simulation File Not Saved",
  //       text: "You need to save the simulation file before saving data.",
  //       icon: "warning",
  //     });
  //   } else {
  //     // Proceed with saving the data as the simulation file is already saved
  //     const requestData = {
  //       indexname: indexname,
  //       sensorData: sensorData,
  //       timestamp: new Date().toISOString() // Include the timestamp in the request
  //     };
  
  //     axios.post('http://localhost:4000/simulation/updateSensorData', requestData)
  //       .then(response => {
  //         console.log ('Data uploaded successfully:', response.data);
  //       })
  //       .catch(error => {
  //         console.error('Error uploading data:', error);
  //       });
  //   }
  // };
  
  
  // const handleBeforeUnload = (event) => {
  //   if (indexname !== ":") {
  //     const requestData = JSON.stringify({
  //       indexname: indexname,
  //       sensorData: sensorData,
  //       timestamp: new Date().toISOString() // Include the timestamp in the request
  //     });
  
  //     axios.post('http://localhost:4000/simulation/updateSensorData', requestData)
  //       .then(response => {
  //         console.log('Data uploaded successfully:', response.data);
  //       })
  //       .catch(error => {
  //         console.error('Error uploading data:', error);
  //       });
  //   }
  //   // Display a confirmation message to the user
  //   event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
  // };

  // useEffect(() => {
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  
  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  function isDifferent(markers, sensorData) {
    // If the arrays have different lengths, they are different
    if (markers.length !== sensorData.length) {
      return true;
    }
  
    // Create a map to easily look up markers by their id
    const markerMap = new Map();
    markers.forEach((marker) => {
      markerMap.set(marker.id, marker);
    });
  
    // Compare each object in sensorData with the corresponding object in markers
    for (const sensor of sensorData) {
      const correspondingMarker = markerMap.get(sensor.id);
  
      if (!correspondingMarker) {
        // If there is no corresponding marker, they are different
        return true;
      }
  
      if (
        sensor.flowrate !== correspondingMarker.flowrate ||
        sensor.totalflow !== correspondingMarker.totalflow ||
        sensor.pressure !== correspondingMarker.pressure ||
        sensor.pressurevoltage !== correspondingMarker.pressurevoltage
      ) {
        // If any of the properties are different, return true
        return true;
      }
    }
  
    // If no differences were found, return false
    return false;
  }
  
  const fetchData = async () => {
    try {
      // Fetch the latest data from the server using axios
      const response = await axios.get('http://localhost:4000/latestdata', {
        params: { indexname: indexname },
      });
      const data = response.data;
      console.log(data);

      // Process the data and update the sensorData state
      const markersData = data.map((hit) => {
        const location = hit.latest_data.location;
        const { lat, lon } = location;
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

  const startSimulation = () => {
    if (indexname === ":") {
      // Display a warning to the user if the file is not saved
      Swal.fire({
        icon: 'warning',
        title: 'Please save the file before starting the simulation.',
      });
    } 
    else
    {
      setIsSimulationRunning(true);

      // Set up an interval to periodically check and upload data
      const intervalId = setInterval(() => {

        fetchData(); // Fetch the latest data

        // Compare your sensorData with the latest data
        if (isDifferent(sensorData, markers)) {
          // Upload the data if it's different
          const requestData = {
            indexname: indexname,
            sensorData: sensorData,
            timestamp: new Date().toISOString() // Include the timestamp in the request
          };
        
          axios.post('http://localhost:4000/simulation/updateSensorData', requestData)
            .then(response => {
              console.log ('Data uploaded successfully:', response.data);
            })
            .catch(error => {
              console.error('Error uploading data:', error);
            });
        }
      }, 10000); // 10 seconds in milliseconds

      // Store the intervalId to clean up later
      setSimulationInterval(intervalId);
    }
  };

  const stopSimulation = () => {
    setIsSimulationRunning(false);
    clearInterval(simulationInterval); // Clear the interval to stop the simulation
  };

  useEffect(() => {
    if(indexname !== ":")
    {
      console.log("Previous simulation data fetched");
      fetchData();
    }
      
  }, [indexname]);


  return (
    <div>
      <div>
        <form onSubmit={handleSaveFile}>
          <label>File name:</label>
          <input
            type="text"
            id="filename"
            name="filename"
            value={formData.filename}
            onChange={handleFileNameChange}
            placeholder="Enter new file name"
          />
          <button type="submit">Save File</button>
        </form>
      </div>
      <br></br>
      <button onClick={addMarker}>Add Marker</button>
      {/* <button onClick={handleSaveData}>Save</button> */}
      <button onClick={startSimulation} disabled={isSimulationRunning}>
        Start Simulation
      </button>
      <button onClick={stopSimulation} disabled={!isSimulationRunning}>
        Stop Simulation
      </button>
      <MapContainer center={[17.4474, 78.3491]} zoom={18} style={{ height: '1000px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {sensorData.map((sensor) => {
          return (
            <Marker
              key={sensor.id}
              position={sensor.position}
              draggable={true}
              icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
              onClick={() => handleMarkerClick(sensor)}
            >
              <Popup>
                <SimulationSensorPopup markers={sensorData.filter((m) => m.position[0] === sensor.position[0] && m.position[1] === sensor.position[1])} onSensorDataChange={handleSensorDataChange} />
              </Popup>
            </Marker>
          );
        })}
        {selectedSensor && (
          <Marker position={selectedSensor.position}>
            <Popup>
              <SimulationSensorPopup markers={sensorData.filter((m) => m.position[0] === selectedSensor.position[0] && m.position[1] === selectedSensor.position[1])} onSensorDataChange={handleSensorDataChange} />
            </Popup>
          </Marker>
        )}
        {isAddingMarker && newMarkerPosition && (
          <Marker
            position={newMarkerPosition}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
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

export default SimulationPageMain;
