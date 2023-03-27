//creating the context called UserContex as below

import React from 'react';

const UserContex=React.createContext();
export const UserProvider=UserContex.Provider;
export const UserConsumer=UserContex.Consumer;

export default UserContex;
