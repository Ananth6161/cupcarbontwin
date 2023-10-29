import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register.js';
import Login from './Login.js';
import IIITHLocation from './components/IIITHLocation';
import Dashboard from './components/VisualizationDashboard';
function App() {
  return (
    <Router>
      <Routes>
        {/* <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/map" element={<IIITHLocation />} /> */}
        <Route exact path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
