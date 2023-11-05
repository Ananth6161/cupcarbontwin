 import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


const SimulationPage = () => {
  const navigate = useNavigate();
  const [userSchema, setUserSchema] = useState(null);
  const [choice, setChoice] = useState(null); // 'view' or 'new'
  const [selectedIndex, setSelectedIndex] = useState('');
  const [availableIndexes, setAvailableIndexes] = useState([]);
  const [formData, setFormData] = useState({/* Your form data here */});
  const [email, setEmail] = useState(null);
  useEffect(() => {
    const emailFromLocalStorage = localStorage.getItem('email');
    setEmail(emailFromLocalStorage);
  }, []); // This effect runs once when the component mounts
  
  useEffect(() => {
    if (email) {
      console.log(email);
      // Fetch user schema to get available index names
      axios.get('http://localhost:4000/simulation/userinfo', {
      params: {
        email: email
      }
    })
      .then((response) => {
        setUserSchema(response.data);
        setAvailableIndexes(response.data.indexes);
      })
      .catch((error) => {
        console.error('Error fetching user schema:', error);
      });
    }
  }, [email]); // This effect runs whenever the 'email' state changes
  
  
    
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
    if(choice === 'view' && availableIndexes.length === 0)
    {
      Swal.fire({
          icon: 'error',
          title: 'No Indexes Available, Please choose new simulation',
      })
    }
    if (choice === 'view' && selectedIndex) {
      // Send the selected index to the backend
      // axios.get('http://localhost:4000/simulation/loading', {
      //   params:
      //   {
      //     emai: email,
      //     indexname: selectedIndex
      //   }  
      //   })
      //   .then((response) => {
          // Handle the response from the backend (e.g., navigate to the simulation page)
          navigate(`main/${selectedIndex}`);
        // })
        // .catch((error) => {
        //   console.error('Error sending selected index to the backend:', error);
        // });
    } else if (choice === 'new') {
      // Send the entered index name to the backend
      navigate('main/:');
    }
  };

  const renderForm = () => {
    if (choice === 'view') {
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
    } 
    else if(choice === 'new')
    {
      return (
        <div>
          <h2>View new Simulation</h2>
          <button type="submit" onClick={handleSubmit}>Submit</button>
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
          {renderForm()}
        </div>
      )}
    </div>
  );
};

export default SimulationPage;
