import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material'
import theme from './components/common/theme'
import Navbar from './components/common/Navbar'
import Logout from './components/common/Logout';
import Register from './Register.js';
import Login from './Login.js';
import SimulationPage from './components/simulation/simulation';
import IIITHLocation from './components/IIITHLocation';
import SimulationPageMain from './components/simulation/simulationpage';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Routes>
            <Route path="*" element={<h1>Not Found</h1>} />
            <Route path="/" element={<Login />} />
            <Route path="user/" element={<Layout />}>
              <Route path="map" element={<IIITHLocation />} />
              <Route path="simulation/">
                <Route path="" element={<SimulationPage />} />
                <Route path="main/:indexname" element={<SimulationPageMain />} />
              </Route>
            </Route>
            <Route exact path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
        
      </div>
    </ThemeProvider>
  );
}


export default App;
