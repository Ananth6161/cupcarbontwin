import React, { useState, useEffect } from 'react';
import axios from "axios";
import { fetchToken } from './getToken';

const SimulationPage = () => {
  const [userSchema, setUserSchema] = useState(null);
  const [choice, setChoice] = useState(null); // 'view' or 'new'
  const [selectedIndex, setSelectedIndex] = useState('');
  const [availableIndexes, setAvailableIndexes] = useState([]);
  const [formData, setFormData] = useState({/* Your form data here */});

  useEffect(() => {
      axios.get('http://localhost:4000/userinfo')
        .then((response) => {
          setUserSchema(response.data);
          setAvailableIndexes(response.data.indexes);
        })
        .catch((error) => {
          console.error('Error fetching user schema:', error);
        });
    }, []);
    
  const handleChoiceChange = (e) => {
    setChoice(e.target.value);
    // Reset selectedIndex and form data if the user changes their choice
    setSelectedIndex('');
    setFormData({indexName: ''});
  };

  const handleIndexChange = (e) => {
    setSelectedIndex(e.target.value);
    // Fetch data from Elasticsearch based on the selected index
    // You can use the selectedIndex to fetch the data
  };
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (choice === 'view' && selectedIndex) {
      // Send the selected index to the backend
      axios.post('http://localhost:4000/simulation', { selectedIndex })
        .then((response) => {
          // Handle the response from the backend (e.g., navigate to the simulation page)
        })
        .catch((error) => {
          console.error('Error sending selected index to the backend:', error);
        });
    } else if (choice === 'new' && formData.indexName) {
      // Send the entered index name to the backend
      axios.post('http://localhost:4000/simulation', { indexName: formData.indexName })
        .then((response) => {
          // Handle the response from the backend (e.g., navigate to the simulation page)
        })
        .catch((error) => {
          console.error('Error sending entered index name to the backend:', error);
        });
    }
  };
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderForm = () => {
    if (choice === 'view' && selectedIndex) {
      // Render form for viewing an existing simulation based on the selected index
      return (
        <div>
          <h2>View Existing Simulation</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Select an Index:
              <select value={selectedIndex} onChange={handleIndexChange}>
                <option value="">Select Index</option>
                {availableIndexes.map((index) => (
                  <option key={index} value={index}>
                    {index}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    } else if (choice === 'new') {
      // Render form for starting a new simulation
      return (
        <div>
          <h2>Start New Simulation</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Index Name:
              <input
                type="text"
                name="indexName"
                value={formData.indexName}
                onChange={handleFormChange}
                placeholder="Enter Index Name"
              />
            </label>
            {/* Additional form fields for new simulation */}
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    }
  };

  return (
    <div>
      <h1>Simulation Page</h1>
      <label>
        <input
          type="radio"
          value="view"
          checked={choice === 'view'}
          onChange={handleChoiceChange}
        />
        View Existing Simulation
      </label>
      <label>
        <input
          type="radio"
          value="new"
          checked={choice === 'new'}
          onChange={handleChoiceChange}
        />
        Start New Simulation
      </label>
      {choice && (
        <div>
          <select value={selectedIndex} onChange={handleIndexChange}>
            <option value="">Select Index</option>
            {availableIndexes.map((index) => (
              <option key={index} value={index}>
                {index}
              </option>
            ))}
          </select>
          {renderForm()}
        </div>
      )}
    </div>
  );
};

export default SimulationPage;
