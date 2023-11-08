import React from 'react';
import { Polyline } from 'react-leaflet';

const Pipe = ({ points, color }) => {
  return <Polyline positions={points} color={color} />;
};

export default Pipe;
