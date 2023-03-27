import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { ApplicationSessionContext } from '../../Context/ApplicationSessionContext';

const AppHeader = (props) => {
    const { setRoute } = useContext(ApplicationSessionContext);

    const navigateUser = (type) => {
        setRoute(type);
    }


return (
    <div style={{
        // width: '20%', height: '50px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
        // alignItems: 'center'
    }}>
        {/* <span onClick={()=>navigateUser('home')}>DashBoard</span> */}
        {/* <span onClick={()=>navigateUser('createuser')} >Create User</span>
        <span>Help</span> */}
    </div>
);
}

export default (AppHeader);