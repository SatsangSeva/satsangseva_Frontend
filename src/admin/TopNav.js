import { Close } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react'
const TopNav = ({ isOpen, setIsOpen, toggleNav, closeNav }) => {
    return (
        <div className='w-full h-20 bg-[#ee7d45] flex justify-between items-center' >
            <ul>
                <span onClick={toggleNav}>
                    {isOpen ? <Close fontSize='large' className='bg-none text-white' /> : <MenuIcon fontSize='large' className='bg-none text-white' />}
                </span>
            </ul>
            <ul></ul>

        </div>
    )
}

export default TopNav
