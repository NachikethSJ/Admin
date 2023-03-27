import React, { useContext, useEffect, useState } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { ApplicationSessionContext } from '../../Context/ApplicationSessionContext';
import * as UrlConfig from '../../Urlconfig';
import "bootstrap/dist/css/bootstrap.min.css";
import moment from 'moment';
import axios from 'axios';

const HeaderComponent = (props) => {

    const { setisLoggedOut, isLoggedOut, userName, setShowLoader, setInfoType, setShowMessage, setInfoMessage } = useContext(ApplicationSessionContext);
    const [roleId, setRoleId] = useState(localStorage.getItem('roleId'));

    useEffect(() => {
        let name = localStorage.getItem('name');
        // if (userName === '' || userName === null || userName === undefined) {
        if (name === '' || name === null || name === undefined) {
            props.history.push('/sessionExpiry/')
        }
    }, [isLoggedOut]);


    //handle logout.. Clear the session variable
    const handleLogout = async () => {
        const loggedinUser = localStorage.getItem('user');
        var myDate = new Date();
        const logoutTime = moment(myDate).format("DD-MM-YYYY HH:mm:ss");

        // e.preventDefault();
        let logoutPayload = {
            email: loggedinUser,
            logoutTime: logoutTime
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            setShowLoader(true);
            console.log('URL is', UrlConfig.baseUrls.login);
            let response = await axios.post(UrlConfig.baseUrls.logout, { logoutPayload }, config);
            if (response.data.status === true) {
                //Need to check here
                setisLoggedOut(true);
                localStorage.clear();//Clears all the localstorage variables availabe in the application
                setShowMessage(true);
                setInfoType('success');
                setInfoMessage(response.data.message);
                props.history.push('/');
            }
            else {
                setShowMessage(true);
                setInfoType('warning');
                setInfoMessage(response.data.message);
            }
        }
        catch (e) {
            console.log('error Occured', e);
            setShowMessage(true);
            setInfoType('warning');
            setInfoMessage('Error while logging out , Please try after sometime');
        }
        finally {
            setShowLoader(false);
        }
    }

    return (

        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <Link
                    // to={"/"}
                    className="navbar-brand">
                    Resource Manager
                </Link>
                <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link
                            to={"/home/"}
                            className="nav-link">
                            Home
                         </Link>
                    </li>
                </div>

                <div className="navbar-nav ml-auto">
                    {
                        roleId === "1" ?
                            <>
                                <li className="nav-item">
                                    <Link
                                        to={"/signup/"}
                                        className="nav-link">
                                        Create Operator
                            </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to={"/forgotPassword/"}
                                        className="nav-link">
                                        Reset Password
                             </Link>
                                </li>

                                {/* <li className="nav-item">
                                    <Link
                                        to={"/create/"}
                                        className="nav-link">
                                        Add Worker
                        </Link>
                                </li> */}
                            </>
                            : <div />
                    }


                    {/* <li className="nav-item">
                        <Link
                            // to={"/create/"}
                            onClick={() => alert('Help section will be coming soon')}
                            className="nav-link">
                            Help
                        </Link>
                    </li> */}

                    <li className="nav-item">
                        <Link
                            to={"/contactus/"}
                            // onClick={() => alert('Help section will be coming soon')}
                            className="nav-link">
                            Contact Us
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link onClick={handleLogout}
                            // to={"/"} 
                            className="nav-link">
                            Logout
                        </Link>

                    </li>
                </div>
            </nav>
        </div>
    );
}

export default withRouter(HeaderComponent);