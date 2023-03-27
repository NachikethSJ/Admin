import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { ApplicationSessionContext } from '../Context/ApplicationSessionContext';
import PhoneNumberValidator from '../Utilities/Utils';
import DatePicker from "react-datepicker";
import HeaderComponent from '../Components/GenericComponents/HeaderComponent';
import moment from 'moment';
import * as UrlConfig from '../Urlconfig';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";
import '../index.css';
import FooterComponent from './GenericComponents/FooterComponent';

const CreateUserComponent = (props) => {

    const [mode, setMode] = useState(props.location.pathname === '/update/' ? 'update' : '')
    const [isRequestUpdated, setIsRequestUpdated] = useState(mode === 'update' ? 'YES' : null);

    const { userName, setShowLoader, setInfoType, setShowMessage, setInfoMessage } = useContext(ApplicationSessionContext);
    const [dashboardrowSelected, setDashboard] = useState(JSON.parse(sessionStorage.getItem('dashboardrowSelected')));


    const [errorObj, setErrorObj] = useState(mode === 'update' ? {
        name: false, age: false, vaillage: false, address: false, skills: false, phone: false, pin: false
    } :
        { name: true, age: true, address: true, phone: true, village: true, pin: true, skills: true });

    const [errorMsg, setErrorMsg] = useState({
        name: '', phone: '', age: '', pin: '', email: '', landMark: '',
        address: '', skills: ''
    });

    const [isCleanFields, setIsCleanFields] = useState(false);
    const [requestId, setRequestId] = useState(mode === 'update' ? dashboardrowSelected && dashboardrowSelected.length &&
        dashboardrowSelected.length > 0 && dashboardrowSelected[0].requestId : null)

    const [phone, setPhone] = useState(mode === 'update' ? dashboardrowSelected && dashboardrowSelected.length &&
        dashboardrowSelected.length > 0 && dashboardrowSelected[0].phone : '');

    const [specialRequest, setSpecialRequest] = useState(mode === 'update' ? dashboardrowSelected && dashboardrowSelected.length &&
        dashboardrowSelected.length > 0 && dashboardrowSelected[0].specialRequest : '');
    // debugger;
    const [landMark, setLandMark] = useState(mode === 'update' ? dashboardrowSelected && dashboardrowSelected.length &&
        dashboardrowSelected.length > 0 && dashboardrowSelected[0].landmark : '');

    const [address, setAddress] = useState(mode === 'update' ? dashboardrowSelected && dashboardrowSelected.length &&
        dashboardrowSelected.length > 0 && dashboardrowSelected[0].address : '');

    const [pin, setPin] = useState(mode === 'update' ? dashboardrowSelected && dashboardrowSelected.length &&
        dashboardrowSelected.length > 0 && dashboardrowSelected[0].pin : '');

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [village, setVillage] = useState('');

    const [state, setState] = useState(mode === 'update' ? dashboardrowSelected && dashboardrowSelected.length &&
        dashboardrowSelected.length > 0 && dashboardrowSelected[0].area : 'Karnataka');

    const [bookingId, setBookingId] = useState(mode === 'update' ? dashboardrowSelected && dashboardrowSelected.length &&
        dashboardrowSelected.length > 0 && dashboardrowSelected[0].bookingId : '');

    const [skills, setSkills] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [division, setDivision] = useState([{ label: "Loading...", value: "0" }]);
    const [zone, setZone] = useState([{ label: "Loading...", value: "0" }]);

    const [zoneId, setZoneId] = useState('');
    const [divisionId, setDivisionId] = useState('');
    const [zoneDisabled, setZoneDisabled] = useState(true);

    useEffect(() => {
        FetchSelectedZones();
        console.log('zone autoselected is', zoneId);
    }, [divisionId, zoneId])

    useEffect(() => {
        console.log('Zone Id Selected is', zoneId);
        console.log('Division Id Selected is', divisionId);
    }, [zoneId, divisionId]);

    useEffect(() => {
        let testDate = '2020-06-04 22:54:27';
        console.log('TEST DATE IS', new Date(testDate));
    })

    useEffect(() => {
        fetchDivisonData();
        fetchZoneData();
    }, []);

    //todo - add exception cases later 
    const FetchSelectedZones = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        let zonePayload = {
            divisionId: divisionId
        }
        try {
            let zoneResponse = await axios.post(UrlConfig.baseUrls.FetchSelectedZones, { zonePayload }, config);
            if (zoneResponse.data.status) {
                let tempZone = [];
                let currentZone = [{ label: '-Select-', value: '0' }]
                // setZone(
                zoneResponse.data.zones.map((zones) => {
                    tempZone.push({ label: zones.zoneName, value: zones.id });
                })
                setZone([...currentZone, ...tempZone])
                // );
                console.log('tempZonoe is', zone);
            }
        }
        catch (e) {
            console.log('Error Occured', e)
        }
    };
    const fetchDivisonData = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let divisionResponse = await axios.post(UrlConfig.baseUrls.fetchdivisions, config);
            if (divisionResponse.data.status) {
                let tempDivison = [];
                let currentDivision = [{ label: '-Select-', value: '0' }]

                divisionResponse.data.divisions.map((divisions) =>
                    tempDivison.push({ label: divisions.divisionName, value: divisions.id }));
                setDivision([...currentDivision, ...tempDivison])
            }
        }
        catch (e) {
            console.log('Error Occured', e)
        }
    };

    const fetchZoneData = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            let zoneResponse = await axios.post(UrlConfig.baseUrls.FetchZones, config);
            if (zoneResponse.data.status) {
                let tempZone = [];
                let currentZone = [{ label: '-Select-', value: '0' }]
                // setZone(
                zoneResponse.data.zones.map((zones) => {
                    tempZone.push({ label: zones.zoneName, value: zones.id });
                })
                setZone([...currentZone, ...tempZone]);
                // );
                console.log('tempZonoe is', zone);
            }
        }
        catch (e) {
            console.log('Error Occured', e)
        }
    };

    const errorDialogue = () => {
        setShowMessage(true);
        setInfoType('warning');
        setInfoMessage('something went wrong Try again later');
        props.history.push('/');
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        let createWorkerPayload = {
            name: name,
            phone: phone,
            age: age,
            divisionId: divisionId,
            zoneId: zoneId,
            skills: skills,
            address: address,
            pin: pin,
            village: village,

        }
        let accessToken = localStorage.getItem('accessToken')
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${accessToken}`
            }
        };
        try {
            setShowLoader(true);
            let response = await axios.post(UrlConfig.baseUrls.createworkerrequest, { createWorkerPayload }, config);
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
                    setInfoType('warning');
                    setInfoMessage(response.data.message);
                    // props.history.push('/');
                }
            }
        }
        catch (e) {
            console.log('error Occured', e);
            setShowMessage(true);
            setInfoType('warning');
            setInfoMessage('Error while creating the request , Please try after sometime');
            // alert('Error while creating the request , Please try after sometime');
        }
        finally {
            setShowLoader(false);
        }
    }

    const isBlank = (value) => {
        if (value !== '' && value !== null && value !== undefined) return true;
    }

    useEffect(() => {
        let value = ''
        if (mode === 'update') {
            value = false;
        }
        else {

            value = Object.keys(errorObj).some(x => errorObj[x]); //returns false(no error) only if any of fields are false rest true only
        }
        validationChecker(value);
        console.log('is Clean field', value);
        setIsCleanFields(value);
    }, [name, phone, age, pin, address, village, skills, landMark, divisionId, zoneId]);

    useEffect(() => {
        let name = localStorage.getItem('name');
        if (name === '' || name === null || name === undefined) {
            props.history.push('/sessionExpiry/')
        }
    });

    //Validation check and count will be updated against the free text fields
    const validationChecker = (isValid) => {
        let value;
        let count = 0;
        let validator = [name, phone, age, address, skills, village, pin];
        validator.map(item => {
            if (item !== '' && zoneId !== '0' && zoneId !== "" && divisionId !== '' && divisionId !== '0' && !isValid) {
                setDisabled(false)
            }
            else {
                setDisabled(true);
            }
        });
        setMode('');
    }
    const onClear = () => {
        setName('');
        // setLastName('');
        setPin('');
        setSkills('');
        setPhone('');
        setAddress('');
        setAge('');
        setVillage('');
    }

    const onCancel = () => {
        props.history.push('/home/')
    }

    const dirtyCheckValidator = (e) => {
        const { value, name } = e.target;
        switch (e.target.name) {
            case 'name':
                if (value === "" || value === " " || value === null) {
                    setErrorObj({ ...errorObj, name: true });
                    setErrorMsg({ ...errorMsg, name: 'Cannot be blank' });
                } else {
                    setErrorObj({ ...errorObj, name: false });
                    setErrorMsg({ ...errorMsg, name: '' });
                }
                break;
            case 'phone':
                let result = PhoneNumberValidator(e.target.value);
                if (result === true) {
                    setErrorObj({ ...errorObj, phone: false });
                    setErrorMsg({ ...errorMsg, phone: '' });
                } else {
                    setErrorObj({ ...errorObj, phone: true });
                    setErrorMsg({ ...errorMsg, phone: result });
                }

                break;
            case 'age':
                if (value === "" || value === null) {
                    setErrorObj({ ...errorObj, age: true });
                    setErrorMsg({ ...errorMsg, age: 'Cannot be blank' });
                } else if (isNaN(value)) {
                    setErrorObj({ ...errorObj, age: true });
                    setErrorMsg({ ...errorMsg, age: 'Enter valid number' });
                }
                else {
                    setErrorObj({ ...errorObj, age: false });
                    setErrorMsg({ ...errorMsg, age: '' });
                }
                break;
            case 'landMark':
                if (e.target.value === '' || e.target.value === null) {
                    setErrorMsg({ ...errorMsg, landMark: 'cannot be blank ' });
                    setErrorObj({ ...errorObj, landMark: true });
                }
                else {
                    setErrorObj({ ...errorObj, landMark: false });
                    setErrorMsg({ ...errorMsg, landMark: ' ' });
                }
                break;
            case 'address':
                if (e.target.value === '' || e.target.value === null) {
                    console.log('cannot be blank ');
                    setErrorObj({ ...errorObj, address: true });
                    setErrorMsg({ ...errorMsg, address: 'cannot be blank ' });
                }
                else {
                    setErrorObj({ ...errorObj, address: false });
                    setErrorMsg({ ...errorMsg, address: ' ' });
                }
                break;

            case 'skills':
                if (value === "" || value === null) {
                    setErrorObj({ ...errorObj, skills: true });
                    setErrorMsg({ ...errorMsg, skills: 'Cannot be blank' });
                } else {
                    setErrorObj({ ...errorObj, skills: false });
                    setErrorMsg({ ...errorMsg, skills: '' });
                }
                break;
            case 'village':
                if (value === '' || value === null) {
                    setErrorObj({ ...errorObj, village: true });
                    setErrorMsg({ ...errorMsg, village: 'Cannot be blank' });
                } else {
                    setErrorObj({ ...errorObj, village: false });
                    setErrorMsg({ ...errorMsg, village: '' });
                }
                break;

            case 'pin':
                if (e.target.value === '' || e.target.value === null) {
                    console.log('cannot be blank ');
                    setErrorObj({ ...errorObj, pin: true });
                    setErrorMsg({ ...errorMsg, pin: 'cannot be blank ' });
                }
                else if (isNaN(e.target.value)) {
                    setErrorObj({ ...errorObj, pin: true });
                    setErrorMsg({ ...errorMsg, pin: 'Enter Nubmers only!' });
                }
                else {
                    setErrorObj({ ...errorObj, pin: false });
                    setErrorMsg({ ...errorMsg, pin: ' ' });
                }
                break;
        }
    }

    const setDataFieldValues = (e) => {
        switch (e.target.name) {
            case 'name': setName(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'phone': setPhone(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'age': setAge(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'skills': setSkills(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'division': setDivisionId(e.target.value);
                if (e.target.value === '0') {
                    setZoneDisabled(true)
                }
                else {
                    setZoneDisabled(false);
                }
                dirtyCheckValidator(e);
                break;
            case 'zone': setZoneId(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'village': setVillage(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'address': setAddress(e.target.value);
                dirtyCheckValidator(e);
                break;
            case 'pin': setPin(e.target.value);
                dirtyCheckValidator(e);
                break;
        }
    }

    return (
        <>
            <HeaderComponent />
            <div className='containerpage'>
                <div style={{ backgroundColor: '', height: '' }}>
                    <h1 style={{ marginLeft: '16px', fontSize: '20px', fontWeight: '200', marginTop: '0px' }}>Add Worker here</h1>
                    <form >
                        <div style={{
                            display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <div className="form-group">
                                <label htmlFor="Name">Name</label>
                                <input className="form-control"
                                    type='text'
                                    value={name} name='name' maxLength='10'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='Name' />
                                {errorMsg.name && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.name}</div>)
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="Phone">Phone</label>
                                <input className="form-control"
                                    type='text'
                                    value={phone} name='phone' maxLength='10'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='Phone' />
                                {errorMsg.phone && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.phone}</div>)
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <input className="form-control"
                                    type='text'
                                    value={age} name='age' maxLength='10'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='Age' />
                                {errorMsg.age && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.age}</div>)
                                }
                            </div>

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'unset', marginTop: '0px', flexDirection: 'row', alignItems: 'center' }}>

                            <div className="form-group" style={{ marginLeft: '220px' }}>
                                <label htmlFor="state">  Division</label>
                                <div >
                                    <select
                                        className='form-control'
                                        name='division'
                                        style={{ width: '200px' }}
                                        onChange={(e) => setDataFieldValues(e)}
                                    >
                                        {division.map(item => (
                                            <option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginLeft: '225px' }}>
                                <label htmlFor="Zone">  Zone</label>
                                <div >
                                    <select
                                        className='form-control'
                                        style={{ width: '200px' }}
                                        name='zone'
                                        onChange={(e) => setDataFieldValues(e)}
                                        disabled={zoneDisabled}
                                    >
                                        {zone.map(item => (
                                            <option
                                                key={item.value}
                                                value={item.value}
                                            >
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginLeft: '220px' }}>
                                <label htmlFor="Skills"> Skills</label>
                                <textarea
                                    className="form-control"
                                    style={{ height: '100px', width: '206px' }}
                                    value={skills} name='skills'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='Ex:coffee picking, tree chopping etc ' />
                                {(errorMsg.skills) && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.skills}</div>)
                                }
                            </div>

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'unset', marginTop: '0px', flexDirection: 'row', alignItems: 'center' }}>
                            <div className="form-group" style={{ marginLeft: '225px' }}>
                                <label htmlFor="Village">  Village</label>
                                <input className="form-control"
                                    type='text'
                                    value={village} name='village'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='any showroom/building' />
                                {(errorMsg.village) && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.village}</div>)
                                }</div>

                            <div className="form-group" style={{ marginLeft: '220px' }}>
                                <label htmlFor="Address">  Address</label>
                                <textarea
                                    className="form-control"
                                    style={{ height: '100px', width: '206px' }}
                                    value={address} name='address'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='Complete Address to Reach you' />
                                {errorMsg.address === true && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.address}</div>)
                                }
                            </div>
                            <div className="form-group" style={{ marginLeft: '225px' }}>
                                <label htmlFor="pin">  PIN</label>
                                <input className='form-control'
                                    type='text' value={pin} name='pin' maxLength='6'
                                    onChange={(e) => setDataFieldValues(e)} placeholder='ex: 560014' />
                                {errorMsg.pin === true ?
                                    <div className="alert alert-danger">{errorMsg.pin}</div> :
                                    null
                                }
                            </div>

                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', flexDirection: 'row', alignItems: 'center' }}>
                        </div>

                    </form>
                    <div className="form-group" style={{ marginTop: '24px' }}>
                        <button
                            style={{ marginTop: '0px', marginLeft: '16px' }} className='btn btn-primary'
                            disabled={disabled} onClick={handleSubmit}>Submit Request</button>
                        <button className='btn btn-primary'
                            style={{ marginLeft: '16px', width: '160px', marginTop: '0px' }} onClick={onClear}>Clear</button>
                        <button className='btn btn-primary'
                            style={{ marginLeft: '16px', width: '160px', marginTop: '0px' }} onClick={onCancel}>Back</button>

                    </div>

                </div>
            </div>
            <FooterComponent />
        </>
    );
}

export default (withRouter(CreateUserComponent));