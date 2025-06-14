
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavComponent from './NavComponent';


const Userlayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <NavComponent />
            <Outlet />
        </div>
    );
};

export default Userlayout;