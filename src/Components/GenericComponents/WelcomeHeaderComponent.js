import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";

const WelcomeHeaderComponent = (props) => {

    return (

        <div >
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link
                            // to={"/"}
                            className="navbar-brand"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            Resource Manager
                </Link>
                    </li>
                </div>
            </nav>
        </div>
    );
}

export default WelcomeHeaderComponent;