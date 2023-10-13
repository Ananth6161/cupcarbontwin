import React from 'react';

const SensorPopup = ({ sensor }) => {
  // Check if sensor is null or undefined before accessing its properties
  if (!sensor) {
    return null; // Return null if sensor is not available
  }

  return (
    <div className="sensor-popup">
      <h2>Sensor Data</h2>
      <p>ID: {sensor.id}</p>
      <div>
        <strong>Data:</strong>
        <ul>
          {sensor.data.map((dataObject, index) => (
            <li key={index}>
              {/* Render each property of the data object */}
              Label: {dataObject.label}, Value: {dataObject.value} 
              {/* Add more properties as needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SensorPopup;
