import React, { Component } from 'react';

const StatusCellRenderer = (props) => {
    debugger;
    const{status}=props.data;
    console.log('here at the Status Cell REndere');
    return (
        
        <span style={{backgroundColor:'red'}}>
            {/* <img src={imageSource} /> */}
            {status }
        </span>
    );
}

export default StatusCellRenderer;