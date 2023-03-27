import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { ApplicationSessionContext } from '../../Context/ApplicationSessionContext';
import './Login.css';
import moment from 'moment';
import * as UrlConfig from '../../Urlconfig';
import axios from 'axios';
import * as AESUtility from '../../Utilities/Encryption/aes256';
import HeaderComponent from '../../Components/GenericComponents/HeaderComponent';
import FooterComponent from '../GenericComponents/FooterComponent';

const SignUpComponent = (props) => {

    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('ZONEMANAGER');

    const { setShowLoader, setInfoType, setShowMessage, setInfoMessage, } = useContext(ApplicationSessionContext);

    const [errorObj, setErrorObj] = useState({ name: '', email: '', phone: '', password: '', confirmPass: '' });
    const [errorMsg, setErrorMsg] = useState({ name: '', email: '', phone: '', password: '', confirmPass: '', });
    const [disabled, setDisabled] = useState(false);
    const [isCleanFields, setIsCleanFields] = useState(false);

    useEffect(() => {
        let value = Object.keys(errorObj).some(x => errorObj[x]); //returns false(no error) only if any of fields are false rest true only
        setIsCleanFields(value);
        let validFields = value;
        validationChecker(validFields);
    }, [name, email, phone, confirmPass, password]);

    const isBlank = (value) => {
        if (value !== '' && value !== null && value !== undefined) return true;
    }

    const validationChecker = (validFields) => {
        debugger;
        let value;
        let count = 0;
        let validator = [name, phone, email, password, confirmPass];
        validator.filter((field) => {
            value = isBlank(field);
            if (value) {
                count++;
            }
        });

        if (count === 5 && !validFields) {
            setDisabled(false);
        }
        else {
            setDisabled(true);
        }
    }

    const setDataFieldValues = (e) => {
        switch (e.target.name) {
            case 'name': setName(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'lastName': setLastName(e.target.value);
                break;
            case 'email': setEmail(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'phone': setPhone(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'password': setPassword(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'confirmPass': setConfirmPass(e.target.value);
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
            case 'name':
                if (e.target.value === '' || e.target.value === null) {
                    setErrorObj({ ...errorObj, name: true });
                    setErrorMsg({ ...errorMsg, name: 'cannot be blank ' });
                }
                else {
                    setErrorObj({ ...errorObj, name: false });
                    setErrorMsg({ ...errorMsg, name: ' ' });

                }
                break;
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
            case 'phone':
                if (e.target.value === '' || e.target.value === null) {
                    console.log('cannot be blank ');
                    setErrorObj({ ...errorObj, phone: true });
                    setErrorMsg({ ...errorMsg, phone: 'cannot be blank ' });
                }
                else if (isNaN(e.target.value)) {
                    setErrorObj({ ...errorObj, phone: true });
                    setErrorMsg({ ...errorMsg, phone: 'Enter Numbers only' });
                }
                else {
                    setErrorObj({ ...errorObj, phone: false });
                    setErrorMsg({ ...errorMsg, phone: ' ' });

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
            case 'confirmPass':
                if (e.target.value === '' || e.target.value === null) {
                    console.log('cannot be blank ');
                    setErrorObj({ ...errorObj, confirmPass: true });
                    setErrorMsg({ ...errorMsg, confirmPass: 'cannot be blank ' });
                }
                else if (e.target.value !== password) {
                    console.log('cannot be blank ');
                    setErrorObj({ ...errorObj, confirmPass: true });
                    setErrorMsg({ ...errorMsg, confirmPass: 'Must be same as password ' });

                }
                else {
                    setErrorObj({ ...errorObj, confirmPass: false });
                    setErrorMsg({ ...errorMsg, confirmPass: ' ' });

                }
                break;
        }
    }

    const handleCancelClick = () => {
        props.history.push('/');
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        var myDate = new Date();
        const creationDateTime = moment(myDate).format("DD-MM-YYYY HH:mm:ss");
        let signupPayload = {
            name: name,
            lastName: lastName,
            email: email,
            gender: (gender === 'ZONEMANAGER' ? "3" : "2"),
            phone: phone,
            password: AESUtility.encryptAES256(password),
            roleId: (gender === 'ZONEMANAGER' ? 3 : 2),
            creationDateTime: creationDateTime,
            isActiveUser: 'Y'
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            setShowLoader(true);
            console.log('URL is', UrlConfig.baseUrls.signup);
            let response = await axios.post(UrlConfig.baseUrls.signup, { signupPayload }, config);
            if (response.data.status === true) {
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
            // console.log('error Occured', e);
            setShowMessage(true);
            setInfoType('warning');
            setInfoMessage('something went wrong Try again later');
        }
        finally {
            setShowLoader(false);
        }
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
                    <form onSubmit={handleLogin}>
                        {/* <label style={{ marginLeft: '70px' }}>
                            Sing Up
                        </label> */}

                        <div className="form-group">
                            <label htmlFor="Name">Name</label>
                            <input
                                className="form-control"
                                // style={{ width: '200px', height: '25px', borderRadius: '5px' }} 
                                type='text' value={name}
                                name='name' onChange={(e) => setDataFieldValues(e)} placeholder='a@gmail.com' />
                            {/* <sp className='error'>*</sp> */}
                            {errorObj.name === true && (
                                <div className="alert alert-danger" role="alert">  {errorMsg.name}</div>
                            )
                            }
                        </div>

                        <div className="form-group">
                            <label htmlFor="LastName">Last Name</label>
                            {/* <div style={{ marginTop: '16px' }}>Last Name:</div> */}
                            <input
                                className="form-control"
                                type='text' value={lastName}
                                name='lastName' maxLength='6' onChange={(e) => setDataFieldValues(e)} placeholder='lastName' />

                        </div>

                        <div className="form-group">
                            <label htmlFor="Email">Email</label>
                            <input
                                className="form-control"
                                type='text' value={email}
                                name='email' onChange={(e) => setDataFieldValues(e)} placeholder='a@gmail.com' />
                            {/* <sp className='error'>*</sp> */}
                            {errorObj.email && (
                                <div className="alert alert-danger" role="alert">  {errorMsg.email}</div>
                            )
                            }
                        </div>
                        <div className="form-group"

                            // style={{ marginTop: '16px' }}
                            onChange={(e) => setGender(e.target.value)}>
                            <label htmlFor='role'> Role : <br />
                                <input type='radio' value="DIVISIONMANAGER" defaultChecked name="gender" />Division Manager <br />
                                <input type='radio' value='ZONEMANAGER' name="gender" />Zone Manager

                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Phone">Phone</label>
                            <input
                                className="form-control"
                                type='text' value={phone}
                                name='phone' maxLength='10' onChange={(e) => setDataFieldValues(e)} placeholder='phone' />
                            {/* <sp className='error'>*</sp> */}
                            {errorObj.phone && (
                                <div className="alert alert-danger" role="alert">  {errorMsg.phone}</div>
                            )
                            }

                        </div>
                        <div className="form-group">
                            <label htmlFor="Password">Password</label>
                            <input
                                className="form-control"
                                type='password' value={password}
                                name='password' maxLength='15' onChange={(e) => setDataFieldValues(e)} placeholder='password' />
                            {/* <sp className='error'>*</sp> */}
                            {errorObj.password && (
                                <div className="alert alert-danger" role="alert">  {errorMsg.password}</div>
                            )
                            }

                        </div>
                        <div className="form-group">
                            <label htmlFor="ConfirmPassword">Confirm Password:</label>
                            <input
                                className="form-control" type='text' value={confirmPass}
                                name='confirmPass' maxLength='15' onChange={(e) => setDataFieldValues(e)} placeholder='same as password' />
                            {errorObj.confirmPass && (
                                <div className="alert alert-danger" role="alert">  {errorMsg.confirmPass}</div>
                            )
                            }

                        </div>
                        <div className="form-group">
                            <button
                                className='btn btn-primary btn-block'
                                disabled={disabled}  >Register</button>
                            <button
                                className='btn btn-primary btn-block'
                                onClick={handleCancelClick}  >Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
            <FooterComponent />
        </>
    );
}

export default (withRouter(SignUpComponent));
