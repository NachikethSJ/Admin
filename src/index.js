import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";

import ApplicationContainer from '../src/Container/ApplicationContainer';
import * as serviceWorker from './serviceWorker';
import ApplicationSessionContext from './Context/ApplicationSessionContext'; //Create and import the router below

ReactDOM.render(<ApplicationSessionContext><ApplicationContainer /></ApplicationSessionContext>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
