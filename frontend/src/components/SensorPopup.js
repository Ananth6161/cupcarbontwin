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
          {Object.keys(sensor).map((key, index) => {
            // Check if the property starts with 'value' before rendering it
            if (key.startsWith('value')) {
              return (
                <li key={index}>
                  Label: {key}, Value: {sensor[key]}
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>
    </div>
  );
};

export default SensorPopup;
