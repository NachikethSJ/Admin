import React from 'react';
import { withRouter } from 'react-router-dom';
import FooterComponent from '../GenericComponents/FooterComponent';

const SessionExpiryComponent = (props) => {

    const onClickHandle = () => {
        // alert('login clicked');
        props.history.push('/');
    }

    return (
        <>
            <div>
                <h4>Session Expired,  to login <a href="" onClick={onClickHandle} style={{ backgroundColor: 'lightblue' }}>Click here</a></h4>
            </div>
            <FooterComponent />
        </>
    );
}

export default (withRouter(SessionExpiryComponent));