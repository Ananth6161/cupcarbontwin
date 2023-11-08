import React from 'react';

const SensorPopup = ({ markers }) => {
  // Check if sensor is null or undefined before accessing its properties
  if (!markers) {
    return null; // Return null if sensor is not available
  }

  return (
    <div>
      {markers.map((marker) => (
        <div key={marker.id}>
          {/* <h2>Sensor Data</h2> */}
          <p>ID: {marker.id}</p>
          <div>
            <strong>Data:</strong>
            <ul> 
              {Object.keys(marker).map(key => (
                <li key={key}>
                  {key} : {marker[key]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>  
  );
};

export default SensorPopup;
