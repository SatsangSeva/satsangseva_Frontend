import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidenav from "./Sidenav"
import TopNav from './TopNav';


const AdminLayout = () => {
  const navRef = useRef(null)
  const naviage = useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const toggleNav = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(event.target)
      ) {
        closeNav();
      }
    };


    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");
    if (!token) {
      naviage("/")
    }
    if (token) {
      if (!admin) {
        naviage("/")
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-screen">
      <TopNav isOpen={isOpen} setIsOpen={setIsOpen} toggleNav={toggleNav} closeNav={closeNav} />
      <Sidenav isOpen={isOpen} setIsOpen={setIsOpen} toggleNav={toggleNav} closeNav={closeNav} ref={navRef} />
      {/* Main content */}
      <div className="flex-1">
        <div className="mx-auto max-h-[80vh] overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;