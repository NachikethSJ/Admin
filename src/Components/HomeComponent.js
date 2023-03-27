import React, { useState, useContext, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ApplicationSessionContext } from '../Context/ApplicationSessionContext';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { gridLayoutColumsData, gridLayoutRowData } from '../GridLayout/GridLayoutInformation'
import '../../src/App.css';
import HeaderComponent from '../Components/GenericComponents/HeaderComponent';
import * as UrlConfig from '../Urlconfig';
import axios from 'axios';
import StatusCellRenderer from './StatusCellRenderer';
import FooterComponent from './GenericComponents/FooterComponent';

const HomeComponent = (props) => { //sfc to open stateless fuctional component 

    const { dashboardData, setInfoType, setShowMessage, setInfoMessage, setShowLoader, setDashboardrowSelected } = useContext(ApplicationSessionContext);
    // const [rowData, setRowdata] = useState(gridLayoutRowData);
    const [rowData, setRowdata] = useState([]);
    const [api, setApi] = useState([]);
    const [rowSelected, setRowSelected] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [user, setUser] = useState('');
    const [logoutTime, setLogoutTime] = useState('');
    const [roleId, setRoleId] = useState(localStorage.getItem('roleId'));
    const [frameworkComponents, setFrameworkComponents] = useState({ statusCellRenderer: StatusCellRenderer })

    useEffect(() => {
        if (dashboardData.length && dashboardData.length > 0) {
            let data = [...rowData, ...dashboardData];
            setRowdata(data);
            alert('New record added successfully!');
        }
    }, [dashboardData]);

    useEffect(() => {
        let name = localStorage.getItem('name');
        let logoutTime = localStorage.getItem('logoutTime');
        setLogoutTime(logoutTime);
        setUser(name);
        if (name === '' || name === null || name === undefined) {
            props.history.push('/sessionExpiry/')
        }
    });

    useEffect(() => {
        fetchDashboardData();
    }, [])

    const onGridReady = ({ api }) => {
        if (api !== null) {
            setApi(api);
        }
    }

    const errorDialogue = () => {
        setShowMessage(true);
        setInfoType('warning');
        setInfoMessage('something went wrong Try again later');
        props.history.push('/');
    }

    const fetchDashboardData = async () => {
        let apiTrailCount = 0;
        let roleId = localStorage.getItem('roleId');
        let userDivisionId = localStorage.getItem('userDivisionId')
        let accessToken = localStorage.getItem('accessToken')
        if (roleId !== null) {
            let dashboardPayload = {
                roleId: roleId,
                userDivisionId: userDivisionId
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            try {
                setShowLoader(true);
                console.log('Config being sent is', config);
                let response = await axios.post(UrlConfig.baseUrls.fetchdashboard, { dashboardPayload }, config);
                //Validate if the token is verified successfully from the server ,if token expired get the token from server and 
                // recall token api to get the refresh token if not say un-authorized access  to push user to login page
                // if (!response.data.status && response.data.isInValidToken) {
                //     //Display user message unauthorized access except for token expiry case
                //     if (response.data.message === 'jwt expired') { //when token is expired
                //         let refreshTokenPayload = {
                //             loggedinUser: localStorage.getItem('user'),
                //             refreshToken: localStorage.getItem('refreshToken')
                //         }
                //         // make necessary setup for new token getting and re-call the function from above
                //         try {
                //             let refreshResponse = await axios.post(UrlConfig.baseUrls.createaccesstoken, { refreshTokenPayload }, config);
                //             // if (refreshResponse.data.status) {
                //             //     localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
                //             //     localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                //                 //Call the main method again to get the dashboard data after setting new access- recurssive call 
                //                 // apiTrailCount++;
                //                 fetchDashboardData(); //There must be a mechanism to limit the number of trails 
                //             // }
                //             // else {
                //             //     errorDialogue();
                //             // }
                //             console.log('response', refreshResponse) //1.if invalid refresh provided - 1.un-authorized access, 2.set token and repeat

                //         }
                //         catch (e) {
                //             errorDialogue();
                //         }

                //     }
                //     else {
                //         // alert('Un-Authorized access'); //Invalidating the user- JWT is invalid/no jwt provided
                //         setShowMessage(true);
                //         setInfoType('warning');
                //         setInfoMessage("Un-Authorized access");
                //         localStorage.clear();
                //         props.history.push('/')
                //     }

                // }
                // else {
                if (response.data.status === true && response.data.data && response.data.data.length > 0) {
                    setRowdata(response.data.data);
                    console.log('Dashboard data is', response.data.data);
                }
                else {
                    // alert(response.data.message);
                    setShowMessage(true);
                    setInfoType('warning');
                    setInfoMessage(response.data.message);
                }

            }
            // }
            catch (e) {
                console.log('error Occured', e);
            }
            finally {
                setShowLoader(false);
            }
        }
    }

    const onRowSelected = (params) => {
        setRowSelected(params.api.getSelectedRows());
        console.log('Row selected', params.api.getSelectedRows());
        if (params.api.getSelectedRows().length > 0 && params.api.getSelectedRows()[0].requestStatus !== 'CANCELLED') {
            setDashboardrowSelected(params.api.getSelectedRows());
            sessionStorage.setItem('dashboardrowSelected', JSON.stringify(params.api.getSelectedRows()));
            setDisabled(false);
        }
        else {
            setDisabled(true);
        }
    }

    const handleReschedule = () => {
        props.history.push('/update/');
    }

    const handleCancel = () => {
        props.history.push('/cancelRequest/');
    }

    const onCellValueChanged = params => {
        console.log('oncell value called ', params);
    }

    return (
        <>
            <HeaderComponent />
            <div className='containerpage'>
                <div style={{ margin: '0px', padding: '0px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div >
                            <h5 style={{ fontWeight: '100' }}>Welcome <b>{user}</b> </h5>
                        </div>
                        <div >
                            Last logged in time : <b>{logoutTime}</b>
                        </div>
                        <div >
                            <h2 style={{ fontSize: '20px', fontWeight: '200' }}> Your Resource Dashboard </h2>
                        </div>
                        <div>
                            {/* <button style={{ borderRadius: '5px', height: '30px' }} onClick={() => props.history.push('/create')}>Create New Booking</button> */}
                        </div>

                    </div>

                    <div
                        className="ag-theme-balham"
                        // className="ag-theme-alpine"
                        style={{
                            // margin: '8px',
                            height: '450px',
                            width: '100%'
                        }} >
                        <hr style={{ clear: 'both', width: '100%' }} />
                        <AgGridReact
                            onGridReady={onGridReady}
                            columnDefs={gridLayoutColumsData}
                            rowData={rowData}
                            enableColResize={true}
                            enableSorting={true}
                            enableFilter={true}
                            floatingFilter={true}
                            onRowSelected={onRowSelected}
                            frameworkComponents={frameworkComponents}
                            onCellValueChanged={onCellValueChanged}
                        >
                        </AgGridReact>
                    </div>
                    {
                        roleId && roleId === '1' ?

                            <div className="form-group">
                                <button disabled={disabled} onClick={handleReschedule}
                                    style={{ marginTop: '24px' }} className='btn btn-primary'
                                >
                                    Re-Schedule</button>
                                <button disabled={disabled} onClick={handleCancel}
                                    className='btn btn-primary'
                                    style={{ marginLeft: '16px', width: '180px', marginTop: '24px' }}>
                                    Cancel Request</button>
                            </div> : null

                    }
                </div >
            </div>
            <FooterComponent />
        </>)
}

export default (withRouter(HomeComponent));;