import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { ApplicationSessionContext } from '../../Context/ApplicationSessionContext';
import './Login.css';
import * as UrlConfig from '../../Urlconfig';
import axios from 'axios';
import * as AESUtility from '../../Utilities/Encryption/aes256';
import HeaderComponent from '../../Components/GenericComponents/HeaderComponent';
import FooterComponent from '../GenericComponents/FooterComponent';


const ForgotPasswordComponent = (props) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');

    const [errorObj, setErrorObj] = useState({ email: '', password: '', cpassword: '' });
    const [errorMsg, setErrorMsg] = useState({ email: '', password: '', cpassword: '' });
    const [disabled, setDisabled] = useState(false);
    const [isCleanFields, setIsCleanFields] = useState(false);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { userName, setUserName, setShowLoader, setInfoType, setShowMessage, setInfoMessage } = useContext(ApplicationSessionContext);

    useEffect(() => {
        let isValid = Object.keys(errorObj).some(x => errorObj[x]); //returns false(no error) only if any of fields are false rest true only
        validationChecker(isValid);
        // setIsCleanFields(isValid);
    }, [email, password, cpassword]);

    const isBlank = (value) => {
        if (value !== '' && value !== null && value !== undefined) return true;
    }

    const validationChecker = (isValid) => {
        let value;
        let count = 0;
        let validator = [email, password, cpassword];
        validator.filter((field) => {
            value = isBlank(field);
            if (value) {
                count++;
            }
        });

        if (count === 3 && !isValid) {
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
            case 'cpassword': setCPassword(e.target.value);
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
                    setErrorObj({ ...errorObj, password: true });
                    setErrorMsg({ ...errorMsg, password: 'cannot be blank ' });
                }
                else {
                    setErrorObj({ ...errorObj, password: false });
                    setErrorMsg({ ...errorMsg, password: '' });

                }
                break;
            case 'cpassword':
                if (e.target.value === '' || e.target.value === null) {
                    setErrorObj({ ...errorObj, cpassword: true });
                    setErrorMsg({ ...errorMsg, cpassword: 'cannot be blank ' });
                }
                else if (password !== e.target.value) {
                    setErrorObj({ ...errorObj, cpassword: true });
                    setErrorMsg({ ...errorMsg, cpassword: 'Password & Confirm password must be same' });
                }
                else {
                    setErrorObj({ ...errorObj, cpassword: false });
                    setErrorMsg({ ...errorMsg, cpassword: '' });
                }
                break;
        }
    }

    const onClickRegister = () => {
        props.history.push('/signup/')
    }
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        let forgotPasswordPayload = {
            email: email,
            password: AESUtility.encryptAES256(password)
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        try {
            // setShowLoader(true);
            let response = await axios.post(UrlConfig.baseUrls.forgotpassword, { forgotPasswordPayload }, config);
            if (response.data.status === true) {
                setShowMessage(true);
                setInfoType('success');
                setInfoMessage(response.data.message);
                props.history.push('/');
            }
            else {
                // alert(response.data.message);
                // setMessage(response.data.message);
                setShowMessage(true);
                setInfoType('warning');
                setInfoMessage(response.data.message);
                // props.history.push('/');
            }
        }
        catch (e) {
            console.log('error Occured', e);
            setShowMessage(true);
            setInfoType('warning');
            setInfoMessage('something went wrong Try again later');
            // props.history.push('/');
        }
        finally {
            // setShowLoader(false);
            setLoading(false);
        }

    }

    const handleCancelClick = () => {
        props.history.push('/');
    }


    return (
        <>
            <HeaderComponent />
            <div className='col-md-12'>
                <div className="card card-container">
                    {/* <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    /> */}
                    <form onSubmit={handleForgotPassword}>
                        <div>
                            <div className="form-group">
                                <label htmlFor="Enter Valid/Existing Email Id">Enter Valid/Existing Email Id</label>
                                <input
                                    // style={{ width: '200px', height: '25px', borderRadius: '5px' }}
                                    className="form-control"
                                    type='text' value={email}
                                    name='email' onChange={(e) => setDataFieldValues(e)} placeholder='a@gmail.com' />
                                {errorObj.email && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.email}</div>)
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="Password">Password</label>
                                <input
                                    className="form-control"
                                    type='text' value={password}
                                    name='password' onChange={(e) => setDataFieldValues(e)} placeholder='password' />
                                {errorObj.password && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.password}</div>)
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="Confirm Password">Confirm Password</label>
                                <input
                                    className="form-control"
                                    type='text' value={cpassword}
                                    name='cpassword' onChange={(e) => setDataFieldValues(e)} placeholder='password' />
                                {errorObj.cpassword && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.cpassword}</div>)
                                }
                            </div>
                        </div>

                        <div className="form-group">
                            <button
                                className="btn btn-primary btn-block"
                                disabled={disabled}  >Submit</button>
                            <button
                                className="btn btn-primary btn-block"
                                onClick={handleCancelClick}  >Cancel</button>
                        </div>
                        {message && (
                            <div className="form-group">
                                <div className="alert alert-danger" role="alert">
                                    {message}
                                </div>
                            </div>
                        )}
                        {loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}

                    </form>
                </div>
            </div>
            <FooterComponent />
        </>
    );
}

export default (withRouter(ForgotPasswordComponent));
