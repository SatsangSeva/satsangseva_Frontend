import React, { forwardRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../redux/AuthContext';
import Logout from '@mui/icons-material/LogoutTwoTone';
import '../Csss/Sidenav.css';

const SideNavbar = forwardRef(({ isOpen, setIsOpen, toggleNav, closeNav }, ref) => {
    const handleLogOut = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("admin");
            localStorage.removeItem("token");
            window.location.reload();
        }
    };
    return (
        <div style={{ zIndex: "10000" }}>
            <div className={`side-navbar ${isOpen ? 'open' : ''}`}>
                <nav className='mt-4' ref={ref}>
                    <Link to="" onClick={closeNav}>Statistics</Link>
                    {/* <Link to="allproduct" onClick={closeNav}>Booking</Link> */}
                    <Link to="allusers" onClick={closeNav}>Total User</Link>
                    <Link to="events" onClick={closeNav}>Events</Link>
                    <Link to="approve" onClick={closeNav}>Approve</Link>
                    <Link to="blog" onClick={closeNav}>Blogs</Link>
                    <Link onClick={handleLogOut}  >
                        LogOut
                        <Logout className="ml-2" />
                    </Link>
                    {/* <button onClick={logout} className="logout-btn">Logout</button>  */}
                    {/* <Link to="coupon" onClick={closeNav}>Coupon</Link>
                    <Link to="categorie" onClick={closeNav}>Categorie</Link>
                    <Link to="brands" onClick={closeNav}>Brands</Link>
                    <Link to="orderdetails" onClick={closeNav}>OrderDetails</Link> */}
                </nav>
            </div>
        </div>
    );
});

export default SideNavbar;
