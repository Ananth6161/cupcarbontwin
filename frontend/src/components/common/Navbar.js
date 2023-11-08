import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Link } from 'react-router-dom';

import Menu from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
import { AppBar, Drawer, IconButton, ListItem, ListItemIcon, Toolbar, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { List } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ListItemButton } from "@mui/material";
import { Map } from '@mui/icons-material';
import logo from '../../assets/images/teacher.png'
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';
import SummarizeIcon from '@mui/icons-material/Summarize';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import LogoutIcon from '@mui/icons-material/Logout';
import "./Navbar.css"

// function Navbar() {
//   const [authenticated, setAuthenticated] = useState(false); // Initialize with false for unauthenticated state
//   const [showDropdown, setShowDropdown] = useState(false); // To control the visibility of the dropdown

//   // Toggle the dropdown visibility
//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   return (
//     <nav style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#333', padding: '10px 20px', position: 'relative', zIndex: 1 }}>
//       <div className="navbar-toggle" style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={toggleDropdown}>
//         <div style={{ width: '20px', height: '2px', backgroundColor: '#fff', margin: '3px 0' }}></div>
//         <div style={{ width: '20px', height: '2px', backgroundColor: '#fff', margin: '3px 0' }}></div>
//         <div style={{ width: '20px', height: '2px', backgroundColor: '#fff', margin: '3px 0' }}></div>
//       </div>
//       <ul style={{ display: showDropdown ? 'flex' : 'none', flexDirection: 'column', position: 'absolute', top: '50px', right: 0, backgroundColor: '#333', border: '1px solid #777', padding: '10px' }}>
//         {authenticated ? (
//           <li style={{ marginBottom: '10px' }}>
//             <Link to="/map" style={{ color: '#fff' }}>View</Link>
//           </li>
//         ) : (
//           <li style={{ marginBottom: '10px' }}>
//             <Link to="/register" style={{ color: '#fff' }}>Register</Link>
//           </li>
//         )}
//         <li style={{ marginBottom: '10px' }}>
//           {authenticated ? <Logout /> : <Link to="/login" style={{ color: '#fff' }}>Login</Link>}
//         </li>
//       </ul>
//     </nav>
//   );
// }

const Navbar = (props) => {

  const { SubMenu } = Menu;
  const location = useLocation();
  const [state, setState] = useState({})
  const routes = ["/user/map", "/user/simulation", "/user/simulation/main", "/logout"]
  const theme = useTheme();
  const [value, setValue] = useState('2')
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const [drawer, setDrawer] = useState(false);


  const GetPageName = () => {
      if (location.pathname.split('/')[2] == 'map') {
          return "Map"
      }
      else if (location.pathname.split('/')[2] == 'simulation') {
          return "Simulation"
      }
  }

  const DrawerHeader = styled('div')(({ theme }) => ({
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-start',
  }));

  const navigate = useNavigate();
  
  const handleDrawerOpen = () => {
      setDrawer(true);
  };

  const handleDrawerClose = () => {
      setDrawer(false);
  };

  const handleLogout = () => {
    localStorage.clear(); // Example: remove authentication token
    navigate('/'); // Redirect to the login page
  };

  return (
      <div style={{ marginBottom: "70px" }}>
          <AppBar
              sx={{
                  background: "white",
                  position: "fixed",
              }}
          >
              <Toolbar>
                  {isMatch ? <>
                      <IconButton
                          onClick={(e) => { setDrawer(true) }}
                      >
                          <MenuIcon />
                      </IconButton>
                      <Box
                          component="img"
                          src={logo}
                          height="25px"
                          width="25px"
                          margin="2%"
                          marginRight="3%"
                      ></Box>
                      <Typography
                      >
                          {GetPageName()}
                      </Typography>
                      <Drawer
                          anchor="right"
                          open={drawer}
                          onClose={(e) => { setDrawer(false) }}
                      >
                          <DrawerHeader align="right">
                              <IconButton onClick={handleDrawerClose}>
                                  {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                              </IconButton>
                          </DrawerHeader>
                          <Divider />
                          <List>
                              <ListItem>
                                  <ListItemIcon>
                                      <Map />
                                      <ListItemButton onClick={() => { setDrawer(false); navigate("map") }}>
                                          Map
                                      </ListItemButton>
                                  </ListItemIcon>
                              </ListItem>
                              <Divider />
                              <ListItem>
                                  <ListItemIcon>
                                      <SummarizeIcon />
                                      <ListItemButton onClick={() => { setDrawer(false); navigate("simulation") }}>
                                          Simulation
                                      </ListItemButton>
                                  </ListItemIcon>
                              </ListItem>
                              <Divider />
                              <ListItem>
                                  <ListItemIcon>
                                      <LogoutIcon />
                                      <ListItemButton onClick={() => { setDrawer(false); handleLogout() }}>
                                          Logout
                                      </ListItemButton>
                                  </ListItemIcon>
                              </ListItem>
                              <Divider />
                          </List>
                      </Drawer>
                  </> :
                      <>
                          <img src={logo} style={{ "height": "45px", "width": "45px" }}></img>
                          <Tabs value={'/user/' + location.pathname.split('/')[2]} textcolor="secondary" indicatorcolor="secondary" variant="scrollable" scrollButtons allowScrollButtonsMobile aria-label="scrollable force tabs example">
                              <Tab label="Map" value={routes[0]} component={Link} to={routes[0]} />
                              
                              <Tab label="Simulation" value={routes[1]} component={Link} to={routes[1]} />
                              
                              <Tab label="Log out" onClick={handleLogout} className="logout-tab"/>
                              
                          </Tabs>
                      </>
                  }
              </Toolbar>
          </AppBar>
      </div>
  );
};

export default Navbar;
