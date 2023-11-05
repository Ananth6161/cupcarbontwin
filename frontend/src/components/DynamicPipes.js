import React from 'react';

const DynamicPipes = ({ size, coordinates }) => {
  return (
    <div>
      {coordinates.map((coordinate, index) => (
        <svg
          key={index}
          width={size}
          height={size}
          style={{ position: 'absolute', left: coordinate[1], top: coordinate[0] }}
        >
          <use xlinkHref="../assets/images/dynamicpipe.svg" />
        </svg>
      ))}
    </div>
  );
};

export default DynamicPipes;