import React, { useContext, useState, useEffect } from 'react';
import HeaderComponent from '../GenericComponents/HeaderComponent';
import { ApplicationSessionContext } from '../../Context/ApplicationSessionContext';
import { withRouter } from 'react-router';
import FooterComponent from '../GenericComponents/FooterComponent';
import * as UrlConfig from '../../Urlconfig';
import moment from 'moment';
import axios from 'axios';

const ChatComponent = (props) => {

    const [name, setName] = useState(localStorage.getItem('name'));
    const [email, setEmail] = useState(localStorage.getItem('user'));
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [errorObj, setErrorObj] = useState({ message: false });
    const [errorMsg, setErrorMsg] = useState({
        name: '', email: '', subject: '', message: ''
    });

    const [disabled, setDisabled] = useState(true);
    const { userName, setShowLoader, setInfoType, setShowMessage, setInfoMessage } = useContext(ApplicationSessionContext);

    useEffect(() => {
        let isValid = Object.keys(errorObj).some(x => errorObj[x]); //returns false(no error) only if any of fields are false rest true only
        if (!isValid && errorMsg.message !== '') {
            setDisabled(false);
        }
        else {
            setDisabled(true);
        }
    }, [subject, message]);

    useEffect(() => {
        let name = localStorage.getItem('name');
        // if (userName === '' || userName === null || userName === undefined) {
        if (name === '' || name === null || name === undefined) {
            props.history.push('/sessionExpiry/')
        }
    }, []);

    const setDataFieldValues = (e) => {
        switch (e.target.name) {
            case 'subject': setSubject(e.target.value);
                break;
            case 'message': setMessage(e.target.value);
                fieldValidator(e);
                break;
        }
    }

    const fieldValidator = (e) => {
        switch (e.target.name) {
            case 'message':
                if (e.target.value === '' || e.target.value === null) {
                    setErrorMsg({ ...errorMsg, message: 'cannot be blank ' });
                    setErrorObj({ ...errorObj, message: true });
                }
                else {
                    setErrorObj({ ...errorObj, message: false });
                    setErrorMsg({ ...errorMsg, message: ' ' });
                }
                break;
        }
    }

    const errorDialogue = () => {
        setShowMessage(true);
        setInfoType('warning');
        setInfoMessage('something went wrong Try again later');
        props.history.push('/');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        var myDate = new Date();
        const creationDateTime = moment(myDate).format("DD-MM-YYYY HH:mm:ss");
        let messagePayload = {
            name: name,
            email: email,
            subject: subject,
            message: message,
            creationDateTime: creationDateTime
        }

        let accessToken = localStorage.getItem('accessToken')
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            }
        }


        setShowLoader(true);
        let response = await axios.post(UrlConfig.baseUrls.sendmessage, { messagePayload }, config);
        //jwt token validation should be updated here

        if (!response.data.status && response.data.isInValidToken) {
            //Display user message unauthorized access except for token expiry case
            if (response.data.message === 'jwt expired') { //when token is expired
                let refreshTokenPayload = {
                    loggedinUser: localStorage.getItem('user'),
                    refreshToken: localStorage.getItem('refreshToken')
                }
                // make necessary setup for new token getting and re-call the function from above
                try {
                    let refreshResponse = await axios.post(UrlConfig.baseUrls.createaccesstoken, { refreshTokenPayload }, config);
                    if (refreshResponse.data.status) {
                        localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
                        localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                        //Call the main method again to get the data - recurssive call 
                        console.log('###########about to make submit call again ############')
                        handleSubmit(e);
                    }
                    else {
                        setShowMessage(true);
                        setInfoType('warning');
                        setInfoMessage('Un-Authorized access');
                        localStorage.clear();
                        props.history.push('/');
                    }
                    console.log('response', refreshResponse) //1.if invalid refresh provided - 1.un-authorized access, 2.set token and repeat
                }
                catch (e) {
                    // alert('something went wrong Try again later');
                    // props.history.push('/');
                    errorDialogue();
                }

            }
            else {
                // alert('Un-Authorized access'); //Invalidating the user- JWT is invalid/no jwt provided
                // props.history.push('/')
                setShowMessage(true);
                setInfoType('warning');
                setInfoMessage('Un-Authorized access');
                localStorage.clear();
                props.history.push('/');
            }

        }
        else {
            if (response.data.status === true) {
                // setUserName(response.data.data.firstName);
                // alert(response.data.message);
                setShowMessage(true);
                setInfoType('success');
                setInfoMessage(response.data.message);
                // props.history.push('/');
                props.history.push('/home/');
            }
            else {
                // alert(response.data.message);
                setShowMessage(true);
                setInfoType('success');
                setInfoMessage(response.data.message);
                // props.history.push('/');
            }

        }
    }


    return (
        <>

            <HeaderComponent />
            <div className='containerpage'>
                <div style={{ margin: '0px', padding: '0px' }}>
                    We're happy to answer any question you have regarding your recent booking/general query. Just send us a message in the
                    below form with question in detail
            </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-around', flexDirection: 'row' }}>
                    <div>
                        <form>
                            <div className="form-group"   >
                                <label htmlFor="Phone">NAME</label>
                                <input style={{ width: '300px' }} className="form-control"
                                    //  className='textBoxStyles'
                                    disabled
                                    type='text'
                                    value={name} name='name' maxLength='10'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='' />

                                {errorObj.name && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.name}</div>)
                                }
                            </div>
                            <div className="form-group"   >
                                <label htmlFor="Email">YOUR EMAIL</label>
                                <input style={{ width: '300px' }} className="form-control"
                                    disabled
                                    type='text'
                                    value={email} name='email' maxLength='20'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='' />

                                {errorObj.email && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.email}</div>)
                                }
                            </div>

                            <div className="form-group"   >
                                <label htmlFor="Subject">SUBJECT</label>
                                <input style={{ width: '300px' }} className="form-control"

                                    type='text'
                                    value={subject} name='subject' maxLength='150'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='' />
                                {/* <div><sp className='error'>*</sp></div> */}
                                {errorObj.subject && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.subject}</div>)
                                }
                            </div>

                            <div className="form-group"   >
                                <label htmlFor="message">YOUR MESSAGE</label>
                                <textarea style={{ width: '300px', height: '150px' }} className="form-control"
                                    type='text'
                                    value={message} name='message' maxLength='500'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='' />
                                {/* <div><sp className='error'>*</sp></div> */}
                                {errorObj.message && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.message}</div>)
                                }
                            </div>
                        </form>
                        <div className="form-group" style={{ marginTop: '24px' }}>
                            <button
                                style={{ marginLeft: '0px', width: '100px' }} className='btn btn-primary'
                                disabled={disabled} onClick={handleSubmit}>send</button>
                            <button className='btn btn-primary'
                                style={{ marginLeft: '16px', width: '100px', marginTop: '0px' }}
                                onClick={() => props.history.push('/home/')}
                                >Cancel</button>
                        </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <b>Address:</b><br/>
                        #301, WeCode Developers inc.<br/>
                        K K Veni Plaza <br/>
                        Bangalore -560016
                    
                    </div>
                </div>
            </div>
            <FooterComponent />
        </>
    );
}

export default withRouter(ChatComponent);