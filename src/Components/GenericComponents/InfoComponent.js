import React, { useContext, useEffect } from 'react';
import { ApplicationSessionContext } from '../../Context/ApplicationSessionContext'

const InfoComponent = (props) => {

    const { showMessage, setShowMessage } = useContext(ApplicationSessionContext);

    useEffect(() => {
        setTimeout(() => {
            setShowMessage(false);
        }, 8000);
    }, [showMessage]);

    return (<div>
        {
            showMessage && props.type && props.message && (
                <div style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: props.type === 'success' ? '#a8e7a8' : '#dd6767', width: '100%', height: '35px'
                }}>
                    <div style={{ marginLeft: '24px' }}>
                        {props.message}
                    </div>
                    <div style={{ marginRight: '24px' }}>
                        <span onClick={() => setShowMessage(false)}>X</span>
                    </div>
                </div>
            )
        }
        {/* {
            showMessage && props.type === 'warning' && (
                <div style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    backgroundColor: '#dd6767', width: '100%', height: '35px'
                }}>
                    <div style={{ marginLeft: '24px' }}>
                        {props.message}
                    </div>
                    <div style={{ marginRight: '24px' }}>
                        <span onClick={() => setShowMessage(false)}>X</span>
                    </div>
                </div>
            )
        } */}

    </div>
    );
}

export default InfoComponent;