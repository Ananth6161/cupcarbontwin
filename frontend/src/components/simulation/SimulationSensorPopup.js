import React, { useState } from 'react';
import './SimulationSensorPopup.css';

const SimulationSensorPopup = ({ markers, onSensorDataChange }) => {
  // Create a state to manage form inputs for each marker
  const [formData, setFormData] = useState(markers.map((marker) => ({ ...marker })));

  // Handle form input changes for a specific marker
  const handleInputChange = (e, markerId) => {
    const { name, value } = e.target;
    setFormData((prevData) =>
      prevData.map((marker) =>
        marker.id === markerId ? { ...marker, [name]: value } : marker
      )
    );
  };

  // Handle OK button click
  const handleOKClick = (markerId) => {
    // Create a callback function that includes the ID
    return () => {
      // Call the parent component's function to update data for the specific marker
      onSensorDataChange(formData, markerId);
    };
  };

  if (!markers) {
    return null;
  }

  return (
    <div>
      {markers.map((marker) => (
        <div key={marker.id} className="sensor-form">
          <form>
            <p>ID: {marker.id}</p>
            <div className="form-field">
              <label>Flowrate:</label>
              <input
                type="text"
                name="flowrate"
                value={formData.find((data) => data.id === marker.id).flowrate}
                onChange={(e) => handleInputChange(e, marker.id)}
              />
            </div>
            <div className="form-field">
              <label>Total Flow:</label>
              <input
                type="text"
                name="totalflow"
                value={formData.find((data) => data.id === marker.id).totalflow}
                onChange={(e) => handleInputChange(e, marker.id)}
              />
            </div>
            <div className="form-field">
              <label>Pressure:</label>
              <input
                type="text"
                name="pressure"
                value={formData.find((data) => data.id === marker.id).pressure}
                onChange={(e) => handleInputChange(e, marker.id)}
              />
            </div>
            <div className="form-field">
              <label>Pressure Voltage:</label>
              <input
                type="text"
                name="pressurevoltage"
                value={formData.find((data) => data.id === marker.id).pressurevoltage}
                onChange={(e) => handleInputChange(e, marker.id)}
              />
            </div>
            <button onClick={handleOKClick(marker.id)}>Ok</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default SimulationSensorPopup;
