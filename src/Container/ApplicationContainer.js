import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from '../App';
import HomeComponent from '../../src/Components/HomeComponent';
import ApplicationHeader from '.././Components/SharedComponents/AppHeader';
import CreateUserComponent from '../Components/CreateUserComponent';
import LoginComponent from '../Components/LoginComponents/LoginComponent';
import SignUpComponent from '../Components/LoginComponents/SignUpComponent';
import SessionExipryComponent from '../Components/LoginComponents/SessionExpiry';
// import ForgotPasssordComponent from '../Components/LoginComponents/ForgotPasswordComponent';
import ForgotPasswordComponent from '../Components/LoginComponents/ForgotPasswordComponent';
import LoaderComponent from '../Components/GenericComponents/LoaderComponent';
import cancelRequestComponent from '../Components/LoginComponents/CancelRequestComponent';
import InfoComponent from '../Components/GenericComponents/InfoComponent';
import ContactUs from '../Components/LiveChatComponent/ChatComponent';
import { ApplicationSessionContext } from '../Context/ApplicationSessionContext'

const ApplicationContainer = (props) => {

    const { infoType, infoMessage } = useContext(ApplicationSessionContext);


    return (
        <div>
            {/* <ApplicationHeader /> */}
            <LoaderComponent />
            <InfoComponent type={infoType} message={infoMessage} />
            <BrowserRouter>
                {/* defalut components like Toast message etc would go here */}
                <Switch>
                    {/* <Route path='/' exact component={App} /> */}

                    <Route path='/' exact component={LoginComponent} />
                    <Route path='/sessionExpiry/' component={SessionExipryComponent} />
                    <Route path='/home/' component={HomeComponent} />
                    <Route path='/create/' component={CreateUserComponent} />
                    <Route path='/signup/' component={SignUpComponent} />
                    <Route path='/forgotPassword/' component={ForgotPasswordComponent} />
                    <Route path='/update/' mode='update' component={CreateUserComponent} />
                    <Route path='/cancelRequest/' component={cancelRequestComponent} />
                    <Route path='/contactus/' component={ContactUs} />

                </Switch>

            </BrowserRouter>
        </div>
    )
}

export default ApplicationContainer;