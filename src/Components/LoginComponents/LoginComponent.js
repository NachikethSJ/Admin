import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { ApplicationSessionContext } from '../../Context/ApplicationSessionContext';
import './Login.css';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import * as UrlConfig from '../../Urlconfig';
import axios from 'axios';
import logo from '../../resources/mymaid.jpg';
import * as AESUtility from '../../Utilities/Encryption/aes256';
import FooterComponent from '../GenericComponents/FooterComponent';
import WelcomeHeaderComponent from '../../Components/GenericComponents/WelcomeHeaderComponent';


const LoginComponent = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorObj, setErrorObj] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState({ email: '', password: '' });
    const [disabled, setDisabled] = useState(false);
    const [isCleanFields, setIsCleanFields] = useState(false);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);


    const { setisLoggedOut, setUserName, setUserId, setShowLoader, setInfoType, setShowMessage, setInfoMessage } = useContext(ApplicationSessionContext);

    useEffect(() => {
        let isValid = Object.keys(errorObj).some(x => errorObj[x]); //returns false(no error) only if any of fields are false rest true only
        validationChecker();
        setIsCleanFields(isValid);
    }, [email, password]);

    useEffect(() => {
        let name = localStorage.getItem('name');
        // let logoutTime = localStorage.getItem('logoutTime');
        // setLogoutTime(logoutTime);
        // setUser(name);
        // if (userName === '' || userName === null || userName === undefined) {
        if (name !== '' && name !== null && name !== undefined) {
            props.history.push('/home/')
        }
    });

    const isBlank = (value) => {
        if (value !== '' && value !== null && value !== undefined) return true;
    }

    const validationChecker = (isValid) => {
        let value;
        let count = 0;
        let validator = [email, password];
        validator.filter((field) => {
            value = isBlank(field);
            if (value) {
                count++;
            }
        });

        if (count === 2 && !isValid) {
            setDisabled(false);
        }
        else {
            setDisabled(true);
        }
    }

    const setDataFieldValues = (e) => {
        switch (e.target.name) {
            case 'email': setEmail(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'password': setPassword(e.target.value);
                dirtyCheckValidator(e);
                break;
        }
    }
    const ValidateEmail = (value) => {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (value.match(mailformat)) {
            return true;
        }
        else {
            return false;
        }
    }

    const dirtyCheckValidator = (e) => {
        switch (e.target.name) {
            case 'email':
                if (e.target.value === '' || e.target.value === null) {
                    console.log('cannot be blank ');
                    setErrorObj({ ...errorObj, email: true });
                    setErrorMsg({ ...errorMsg, email: 'cannot be blank ' });
                }
                else if (!ValidateEmail(e.target.value)) {
                    setErrorObj({ ...errorObj, email: true });
                    setErrorMsg({ ...errorMsg, email: 'Enter Valid Email address!' });
                }
                else {
                    setErrorObj({ ...errorObj, email: false });
                    setErrorMsg({ ...errorMsg, email: ' ' });

                }
                break;
            case 'password':
                if (e.target.value === '' || e.target.value === null) {
                    console.log('cannot be blank ');
                    setErrorObj({ ...errorObj, password: true });
                    setErrorMsg({ ...errorMsg, password: 'cannot be blank ' });
                }
                else {
                    setErrorObj({ ...errorObj, password: false });
                    setErrorMsg({ ...errorMsg, password: ' ' });

                }
                break;
        }
    }

    const onClickRegister = () => {
        props.history.push('/signup/')
    }

    const handleForgotPassword = () => {
        props.history.push('/forgotPassword/');
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        //Preventing Duplicate Login/Duplicate application Session 
        let loggedinUser = localStorage.getItem('user');
        if (loggedinUser === null) {
            setLoading(true);
            // e.preventDefault();
            let loginPayload = {
                email: email,
                password: AESUtility.encryptAES256(password),
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            // alert(`user Name is ${email} and passwords ${password} are verified!`);

            try {
                // setShowLoader(true);
                console.log('URL is', UrlConfig.baseUrls.login);
                let response = await axios.post(UrlConfig.baseUrls.login, { loginPayload }, config);
                if (response.data.status === true && response.data.data !== undefined && response.data.data !== '') {
                    setisLoggedOut(false);
                    setUserName(response.data.data.firstName);
                    setUserId(response.data.data.userId)
                    //store logged in Name and User Id in local storage and can be made available if page refreshed too..

                    localStorage.setItem('user', email);// Here needs to be checked
                    localStorage.setItem('name', response.data.data.firstName);
                    localStorage.setItem('id', response.data.data.userId);
                    localStorage.setItem('roleId', response.data.data.roleId);
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                    localStorage.setItem('accessToken', response.data.accessToken);
                    localStorage.setItem('logoutTime', response.data.data.logoutTime === null ? 'N/A' : response.data.data.logoutTime);
                    localStorage.setItem('userDivisionId', response.data.userDivisionId);
                    props.history.push('/home/');
                }
                else {
                    setShowMessage(true);
                    setInfoType('warning');
                    setInfoMessage(response.data.message);
                }
            }
            catch (e) {
                // console.log('error Occured', e);
                // alert('Error while login , Please try after sometime');
                setShowMessage(true);
                setInfoType('warning');
                setInfoMessage('Error while login , Please try after sometime');
                // props.history.push('/');
            }
            finally {
                setLoading(false);
                setShowLoader(false);
            }
        }

        else {
            setShowMessage(true);
            setInfoType('warning');
            setInfoMessage('Sorry! You cannot login As only one User session allowed');
            // return  
        }
    }

    const required = value => {
        if (!value) {
            return (
                <div className="alert alert-danger" role="alert">
                    This field is required!
                </div>
            );
        }
    };

    return (
        <>
            <WelcomeHeaderComponent />
            <div className='col-md-12'>
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />
                    <div>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="username">Email</label>
                                <input
                                    className="form-control"
                                    type='text' value={email}
                                    name='email' onChange={(e) => setDataFieldValues(e)}
                                    placeholder='a@gmail.com'
                                // validations={[required]}
                                />
                                {/* <sp className='error'>*</sp> */}
                                {errorObj.email === true ?
                                    // <div className='error'>{errorMsg.email}</div>
                                    <div className="alert alert-danger" role="alert">  {errorMsg.email}</div>
                                    :
                                    null
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    className="form-control"
                                    type='text' value={password}
                                    name='password' maxLength='15' onChange={(e) => setDataFieldValues(e)}
                                    placeholder='password' />
                                {errorObj.password === true ?
                                    <div className="alert alert-danger" role="alert">  {errorMsg.password}</div>
                                    :
                                    null
                                }
                            </div>
                            <div className="form-group">
                                <button
                                    className="btn btn-primary btn-block"
                                    disabled={disabled}>
                                    Login
                            </button>
                                {loading && (
                                    <span className="spinner-border spinner-border-sm"></span>
                                )}
                            </div>
                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                            {/* <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                                <a href='' onClick={onClickRegister}>New User ? Register here</a>
                            </div>

                            <a href='' onClick={handleForgotPassword}>Forgot Password ? Reset here</a> */}
                        </form>
                    </div>
                </div>
            </div >
            <FooterComponent />
        </>
    );
}

export default (withRouter(LoginComponent));
