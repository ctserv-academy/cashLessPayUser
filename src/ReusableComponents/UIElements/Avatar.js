import React from 'react';

import attach from '../UploadFiles/assets/attach.png';

import './Avatar.css';

const Avatar = props => {
  return (
    <div className={`avatar-ui ${props.className}`} style={props.style}>
      <img
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width, borderRadius: 0 }}
        onError={(event) => { event.target.src = attach }}
      />
    </div>
  );
};

export default Avatar;
