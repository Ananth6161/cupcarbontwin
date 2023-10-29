import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register.js';
import Login from './Login.js';
import Logout from './Logout.js';
import SimulationPage from './components/simulation';
import IIITHLocation from './components/IIITHLocation';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar /> {}
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/map" element={<IIITHLocation />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/simulation" element={<SimulationPage/>} />
      </Routes>
    </Router>
  );
}


export default App;
