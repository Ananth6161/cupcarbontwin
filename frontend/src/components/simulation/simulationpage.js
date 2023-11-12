import React, { useState, useEffect, useRef, useCallback } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet';
import axios from "axios";
import SimulationSensorPopup from './SimulationSensorPopup';
import { useParams } from 'react-router-dom';
import GraphComputationComponent from './Graph';
import Swal from 'sweetalert2';
import Pipe from '../pipe';

const SimulationPageMain = () => {
  // console.log("Rendering once");
  const { indexname: initialIndexName } = useParams(); // Use the indexname from useParams directly
  const [indexname, setIndexName] = useState(initialIndexName);
  const [sensorData, setSensorData] = useState([]);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [email, setEmail] = useState(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationInterval, setSimulationInterval] = useState(null);
  const [formData, setFormData] = useState({
    filename: initialIndexName,
  });
  const [graph, setGraph] = useState(new Map());
  var indextosend = indexname;
  
  useEffect(() => {
    // This effect handles updates to sensorData
    const updateSensorData = () => {
      // Update sensorData as needed
    };

    // Call the updateSensorData function when sensorData changes
    updateSensorData();
  }, [sensorData]);

  useEffect(() => {
    const emailFromLocalStorage = localStorage.getItem('email');
    setEmail(emailFromLocalStorage);
  }, []);
  
  useEffect(() => {
    
    if (initialIndexName === ":") {
      indextosend = "finaltempdata1";
    }

    const createGraphComponent = async (data) => {
        const graphComponent = new GraphComputationComponent({ initialNodes: data });
        graphComponent.addEdge("WM-WF-PH01-00", "WM-WF-PH03-70", 1);
        graphComponent.addEdge("WM-WF-PH03-70", "WM-WF-PH03-02", 1);
        graphComponent.addEdge("WM-WF-PH03-70", "WM-WF-PH03-03", 1);
        graphComponent.addEdge("WM-WF-PH03-70", "WM-WF-PH03-00", 1);
        graphComponent.addEdge("WM-WF-PH03-70", "WM-WF-PH03-01", 1);
        graphComponent.addEdge("WM-WF-VN04-71", "WM-WF-VN04-70", 1);
        graphComponent.addEdge("WM-WF-VN04-70", "WM-WF-PH02-70", 1);
        graphComponent.addEdge("WM-WF-KB04-70", "WM-WF-KB04-73", 1);
        graphComponent.addEdge("WM-WF-KB04-70", "WM-WF-PH04-70", 1);
        graphComponent.addEdge("WM-WF-KB04-70", "WM-WF-PH04-71", 1);
        graphComponent.addEdge("WM-WF-KB04-73", "WM-WF-KB04-72", 1);
        graphComponent.addEdge("WM-WF-PH04-70", "WM-WF-KB04-72", 1);
        graphComponent.addEdge("WM-WF-KB04-72", "WM-WF-PH04-71", 1);
        graphComponent.addEdge("WM-WF-KB04-72", "WM-WF-BB04-71", 1);
        graphComponent.addEdge("WM-WF-BB04-71", "WM-WF-BB04-70", 1);

        return graphComponent;
      };

    const fetchData1 = async () => {
      try {
        const response = await axios.get('http://localhost:4000/latestdata', {
          params: { indexname: indextosend }
        });
        const data = response.data;
        const markersData = data.map((hit) => {
            const coordinates = hit.latest_data.location;
            const [lat, lon] = coordinates.split(',').map(parseFloat);
            return {
              id: hit.sensor_id,
              position: [lat, lon],
              flowrate: hit.latest_data.flowrate,
              totalflow: hit.latest_data.totalflow,
              // pressure: hit.latest_data.pressure,
              // pressurevoltage: hit.latest_data.pressurevoltage
            };
        });
      
        setSensorData(markersData);

        const graphComponent = await createGraphComponent(markersData);
        setGraph(graphComponent);
      } catch (error) {
        console.error('Error fetching data from Elasticsearch:', error);
      }
    };

    fetchData1();
  }, []);

  const addMarker = () => {
    const markerId = sensorData.length + 1;
    const newMarker = {
      id: markerId,
      position: [17.4474, 78.3491],
      flowrate: 0,
      totalflow: 0,
      // pressure: 0,
      // pressurevoltage: 0
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

  const handleSensorDataChange = (popupformData, markerId) => {
    if (initialIndexName === ":" && indexname === ":") {
      // Display a warning to the user if the file is not saved
      Swal.fire({
        icon: 'error',
        title: 'Please save the file before starting the simulation.',
      });
    } else {
      console.log("Form Data:", popupformData);
      console.log("Sensor ID:", markerId);
      const changedSensor = sensorData.find((sensor) => sensor.id === markerId);
      const formDataSensor = popupformData.find((sensor) => sensor.id === markerId);
  
      if (formDataSensor) {
        // Update the sensorData for the specific sensor with the matching markerId
        const updatedData = sensorData.map((sensor) => {
          if (sensor.id === markerId) {
            return { ...sensor, ...formDataSensor }; // Merge the formDataSensor data into the sensorData
          }
          return sensor;
        });
  
        setSensorData(updatedData);
        console.log("Updated Sensor Data:", updatedData);
        console.log("New Sensor Data:", sensorData);
        // Update the graph with the new values
        updateSensorBasedOnGraph(graph, changedSensor, formDataSensor);

        // setGraph(updatedGraph);
        console.log("after graph Sensor Data:", sensorData);
      } else {
        // Handle the case where no matching sensor is found in formData
        console.log(`Sensor with ID ${markerId} not found in formData.`);
      }
    }
  };
  
  
  function updateSensorBasedOnGraph(graph, changedSensor, formDataSensor) {
    // console.log('hi');
    const { id, flowrate, totalflow } = changedSensor;
    // const newData = sensorData.find((sensor) => sensor.id === id);
    // console.log('new data of sensor in graph:', newData);
    const newData = formDataSensor;
    var ratio = 1;
    if (flowrate !== 0) {
     ratio = newData.flowrate / flowrate;
    }
    
    
    // Determine the neighbors of the changed sensor in the graph

    // console.log('id :',id);
    const neighbors = graph.getNeighbors(id);
    // console.log('neibhours:',neighbors);
    const visited = new Set();
  
    // Depth-first traversal function
    const traverse = (nodeId) => {
      visited.add(nodeId); // Mark the current node as visited at the beginning
    
      // Update the values of the neighboring nodes in the graph
      neighbors.forEach((neighbor) => {
        const neighborId = neighbor.id;
        console.log('neibhours id:',neighborId);
        if (!visited.has(neighborId)) {
          const neighborData = sensorData.find((sensor) => sensor.id === neighborId);
    
          if (neighborData) {
            // Check if flowrate is zero for the neighbor before calculation
            if (neighborData.flowrate !== 0) {
              // Handle the case where neighbor's flowrate is zero
              neighborData.flowrate *= ratio;
            }
            else
            {
              neighborData.flowrate = flowrate;
            }
            neighborData.totalflow = newData.totalflow;
    
            const newsensorData = sensorData.map((sensor) => {
              if (sensor.id === neighborId) {
                return { ...sensor, ...neighborData };
              }
              return sensor;
            });
    
            setSensorData(newsensorData);
            traverse(neighborId);
          }
        }
      });
    };
    
    // Start the traversal from the changedSensor node
    traverse(id);
  }
  
  const handleFileNameChange = (e) => {
    e.preventDefault();
    
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
    } 
    else if (formData.filename === initialIndexName) {    } 
    else if (initialIndexName === ":" & indexname === ":") {
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
                  title: 'File saved successfully, simulation can start now',
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

  function isDifferent(markers, sensorData) {
    // If the arrays have different lengths, they are different
    // console.log('Markersdata:', markers);
    // console.log('Sensor data:', sensorData);
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
        sensor.totalflow !== correspondingMarker.totalflow
        // sensor.pressure !== correspondingMarker.pressure ||
        // sensor.pressurevoltage !== correspondingMarker.pressurevoltage
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
      // console.log('Response:', response);
      const data = response.data;
      const markersData = data.map((hit) => {
          const coordinates = hit.latest_data.location;
          const [lat, lon] = coordinates.split(',').map(parseFloat);
          return {
            id: hit.sensor_id,
            position: [lat, lon],
            flowrate: hit.latest_data.flowrate,
            totalflow: hit.latest_data.totalflow,
            // pressure: hit.latest_data.pressure,
            // pressurevoltage: hit.latest_data.pressurevoltage
          };
      });
      // console.log('Markers data:', markersData);
      return markersData;
   
    } catch (error) {
      console.error('Error fetching data from Elasticsearch:', error);
    }
  };

  const startSimulation = async () => {
    if (initialIndexName === ":" && indexname === ":") {
      // Display a warning to the user if the file is not saved
      Swal.fire({
        icon: 'error',
        title: 'Please save the file before starting the simulation.',
      });
    } else {
      setIsSimulationRunning(true);
  
      // Set up an interval to periodically check and upload data
      const intervalId = setInterval(async () => {
        // console.log('hi');
        try {
          const markersData = await fetchData(); // Fetch the latest data
          // console.log('dheeraj:', markersData);
  
          // Compare your sensorData with the latest data
          if (isDifferent(markersData, sensorData)) {
            // Upload the data if it's different
            const requestData = {
              indexname: indexname,
              sensorData: sensorData,
              timestamp: new Date().toISOString(), // Include the timestamp in the request
            };
  
            axios
              .post('http://localhost:4000/simulation/updateSensorData', requestData)
              .then((response) => {
                console.log('Data is different and uploaded successfully');
              })
              .catch((error) => {
                console.error('Error uploading data:', error);
              });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
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

  const dynamicPipeSize = 40;
  const pipeData = [
    [[17.445793,78.351444], [17.445585517226135,78.35123061528631], [17.446997987595438,78.34955155849458],[17.447755394735346,78.34861823145404],[17.447095222471898,78.34800155182859],[17.447324,78.347749]], // Example pipe coordinates
    // Add more pipe coordinates as needed
    [[17.446997987595438,78.34955155849458],[17.445570164227213,78.34830200159946],[17.44636851845649,78.34728828544641],[17.445073749898924,78.34603336564616],[17.444881,78.346202]],
    [[17.445585517226135,78.35123061528631],[17.444730864986067,78.35042595712052],[17.444925337105342,78.3502379800931],[17.444689923460846,78.35000217802154],[ 17.444958,78.349694],[17.445016,78.349753],[ 17.445046,78.349719],[17.445544,78.349168],[17.445584,78.348997]],
    [[17.444925337105342,78.3502379800931],[17.445191456511374,78.3504960085306],[17.445237515599914,78.35054377393108],[17.445482,78.3503],[17.445518,78.350403],[17.446348047878896,78.34952430616724],[17.446267,78.349436]],
    [[17.444730864986067,78.35042595712052],[17.443129,78.348927],[17.443482144331,78.34855901016505],[17.443299,78.348365]],
    [[17.444787159568243,78.34987352212234],[17.445104455979063,78.35021149728311],[17.445369,78.349937]]
    
  ];
  
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
      <br></br>
      <button onClick={startSimulation} disabled={isSimulationRunning}>
        Start Simulation
      </button>
      <button onClick={stopSimulation} disabled={!isSimulationRunning}>
        Stop Simulation
      </button>
      <MapContainer center={[17.4474, 78.3491]} zoom={18} style={{ height: '1000px', width: '100%' }} onClick = {handleMapClick}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pipeData.map((pipe) => (
          <Pipe points={pipe} color="blue" />
        ))}
        {sensorData.map((sensor) => {
          return (
            <Marker
              key={sensor.id}
              position={sensor.position}
              draggable={true ? sensor.id[0] != 'W' : false}
              icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
              onClick={() => handleMarkerClick(sensor)}
              eventHandlers={{
                dragend: (e) => {
                  const updatedPosition = e.target.getLatLng(); // Get the updated position
                  const updatedMarkers = sensorData.map((m) => {
                    if (m.id === sensor.id) {
                      return { ...m, position: [updatedPosition.lat, updatedPosition.lng] };
                    }
                    return m;
                  });
                  setSensorData(updatedMarkers); // Update the markers array with the new position
                }
              }}
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
