import React, { useContext } from 'react';
import UserContext from './UserContext';

//Consuming the context value in HomePage
function HomePage() {

    const user = useContext(UserContext);
    console.log(user);

    return null
}