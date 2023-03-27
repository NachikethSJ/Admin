//Create the context to be used in the application 

import React, { createContext, useState } from 'react';


export const ApplicationSessionContext = createContext();

const ApplicationSessionContextProvider = (props) => {

    const [userName, setUserName] = useState('');
    const [dashboardData, setDashboardData] = useState([]);
    const [route, setRoute] = useState('default');
    const [showLoader, setShowLoader] = useState(false);
    const [userId, setUserId] = useState('');
    const [dashboardrowSelected, setDashboardrowSelected] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [infoType, setInfoType] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [isLoggedOut, setisLoggedOut] = useState(false);

    return (
        <ApplicationSessionContext.Provider
            value={{
                userName, setUserName, dashboardData, setDashboardData, route, setRoute, showLoader, setShowLoader,
                userId, setUserId, dashboardrowSelected, setDashboardrowSelected, showMessage, setShowMessage,
                infoType, setInfoType, infoMessage, setInfoMessage, isLoggedOut, setisLoggedOut

            }}>
            {props.children}
        </ApplicationSessionContext.Provider >
    )
};

export default ApplicationSessionContextProvider;