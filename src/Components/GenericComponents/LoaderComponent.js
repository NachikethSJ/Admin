import React, { useContext } from 'react';
import './Loader.css';
import { ApplicationSessionContext } from '../../Context/ApplicationSessionContext';


const LoaderComponet = (props) => {

    const { showLoader } = useContext(ApplicationSessionContext);

    return (
        <div className='container'>
            {showLoader ?
                <div className='loader'>

                </div> : null
            }
        </div>
    );
}

export default LoaderComponet;