import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { ApplicationSessionContext } from '../../Context/ApplicationSessionContext';
import './Login.css';
import * as UrlConfig from '../../Urlconfig';
import axios from 'axios';
import FooterComponent from '../GenericComponents/FooterComponent';


const CancelRequestComponent = (props) => {

    const { dashboardrowSelected, setShowLoader, setInfoType, setShowMessage, setInfoMessage } = useContext(ApplicationSessionContext);


    const [requestId, setRequestId] = useState(dashboardrowSelected && dashboardrowSelected.length &&
        dashboardrowSelected.length > 0 && dashboardrowSelected[0].requestId ? dashboardrowSelected[0].requestId : null);

    const [cancelComment, setCancelComment] = useState('');

    const [errorObj, setErrorObj] = useState({ cancelComment: '' });
    const [errorMsg, setErrorMsg] = useState({ cancelComment: '' });
    const [disabled, setDisabled] = useState(false);
    const [isCleanFields, setIsCleanFields] = useState(false);



    useEffect(() => {
        let isValid = Object.keys(errorObj).some(x => errorObj[x]); //returns false(no error) only if any of fields are false rest true only
        validationChecker(isValid);
        // setIsCleanFields(isValid);
    }, [cancelComment]);

    const isBlank = (value) => {
        if (value !== '' && value !== null && value !== undefined) return true;
    }

    const validationChecker = (isValid) => {
        let value;
        let count = 0;
        let validator = [cancelComment];
        validator.filter((field) => {
            value = isBlank(field);
            if (value) {
                count++;
            }
        });

        if (count === 1 && !isValid) {
            setDisabled(false);
        }
        else {
            setDisabled(true);
        }
    }

    const setDataFieldValues = (e) => {
        switch (e.target.name) {
            case 'cancelComment': setCancelComment(e.target.value);
                dirtyCheckValidator(e);
                break;
        }
    }

    const dirtyCheckValidator = (e) => {
        switch (e.target.name) {
            case 'cancelComment':
                if (e.target.value === '' || e.target.value === null) {
                    setErrorObj({ ...errorObj, cancelComment: true });
                    setErrorMsg({ ...errorMsg, cancelComment: 'cannot be blank ' });
                }
                else {
                    setErrorObj({ ...errorObj, cancelComment: false });
                    setErrorMsg({ ...errorMsg, cancelComment: ' ' });

                }
                break;
        }
    }

    const handleCancelRequest = async (e, isCalledAgain) => {
        e.preventDefault();
        let isConfirm;
        if (isCalledAgain) {
            isConfirm = true;
        }
        else {
            isConfirm = window.confirm('Are you sure want to cancel the Booking ?');
        }
        // if (window.confirm('Are you sure want to cancel the Booking ?')) {
        if (isConfirm) {
            let cancelPayload = {
                cancelComment: cancelComment,
                requestId: requestId
            }
            let accessToken = localStorage.getItem('accessToken');

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${accessToken}`
                }
            };

            try {
                setShowLoader(true);
                let response = await axios.post(UrlConfig.baseUrls.cancelrequest, { cancelPayload }, config);

                if (!response.data.status && response.data.isInValidToken) {
                    //Display user message unauthorized access except for token expiry case
                    if (response.data.message === 'jwt expired') { //when token is expired
                        let refreshTokenPayload = {
                            loggedinUser: localStorage.getItem('name'),
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
                                handleCancelRequest(e, true);
                            }
                            else {
                                // alert('Un-Authorized access');
                                // props.history.push('/');
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
                            setShowMessage(true);
                            setInfoType('warning');
                            setInfoMessage('something went wrong Try again later');
                            // props.history.push('/');
                            props.history.push('/');
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
                        // alert(response.data.message);
                        setShowMessage(true);
                        setInfoType('success');
                        setInfoMessage(response.data.message);
                        props.history.push('/home/');
                    }
                    else {
                        setShowMessage(true);
                        setInfoType('success');
                        setInfoMessage(response.data.message);
                        props.history.push('/');
                        // alert(response.data.message);
                    }
                }

            }
            catch (e) {
                console.log('error Occured', e);
                setShowMessage(true);
                setInfoType('warning');
                setInfoMessage('something went wrong Try again later');
                // props.history.push('/');
                // props.history.push('/');
            }
            finally {
                setShowLoader(false);
            }
        }

    }

    const handleCancelClick = () => {
        props.history.push('/home/');
    }


    return (
        <>
            <div className='parentContainer'>
                <div>
                    <form onSubmit={handleCancelRequest}>
                        <div>
                            <label>
                                {/* <div>Reason for Cacellation:</div> */}
                                <label htmlFor='reasonforcancellation'>Reason for Cacellation</label>
                                <textarea
                                    className="form-control"
                                    style={{ width: '250px', height: '100px', borderRadius: '5px' }} type='text'
                                    value={cancelComment}
                                    name='cancelComment' onChange={(e) => setDataFieldValues(e)} placeholder='Due to unavoidable 
                                circumstance' />
                                {/* <sp className='error'>*</sp> */}
                                {errorObj.cancelComment === true && (
                                    <div className="alert alert-danger" role="alert">  {errorMsg.cancelComment}</div>)
                                }
                            </label>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <button style={{ width: '105px' }}
                                className='btn btn-primary'
                                disabled={disabled}  >Submit</button>

                            <button style={{ width: '105px' }}
                                className='btn btn-primary'
                                onClick={handleCancelClick}  >Cancel</button>
                        </div>
                    </form>
                </div>
            </div >
            <FooterComponent />
        </>
    );
}

export default (withRouter(CancelRequestComponent));
