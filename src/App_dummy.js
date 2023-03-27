 import React from 'react';
import HomePage from './HomePage';
import { UserProvider } from './UserContext';

function App() {

    const user = { name: 'KD', lastName: 'Goutham' };
//Provider is being used to wrap the app/parent components
    return (
        <UserProvider value={user}>
            <HomePage />

        </UserProvider >

    )
}


