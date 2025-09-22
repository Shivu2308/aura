import React from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { LiaFileVideo } from "react-icons/lia";
import { LuCirclePlus } from "react-icons/lu";
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Nav = () => {
    const navigate = useNavigate()
    const {userData} = useSelector(state => state.user)
    return (
        <div className='w-[90%] lg:w-[40%] h-[70px] bg-black flex justify-around items-center fixed bottom-5 rounded-full shadow-2xl shadow-[#000000] z-[100]'>
            <div onClick={() => navigate("/")}>
                <GoHomeFill className='text-white w-[25px] h-[25px] cursor-pointer'/>
            </div>
            <div onClick={() => navigate("/search")}>
                <FiSearch className='text-white w-[25px] h-[25px] cursor-pointer'/>
            </div>
            <div onClick={() => navigate("/upload")}>
                <LuCirclePlus className='text-white w-[25px] h-[25px] cursor-pointer'/>
                </div>
            <div onClick={() => navigate("/vibes")}>
                <LiaFileVideo className='text-white w-[25px] h-[25px] cursor-pointer'/>
            </div>
            <div onClick={() => navigate(`/profile/${userData.userName}`)}
             className='w-[40px] h-[40px] rounded-full cursor-pointer overflow-hidden'>
                <img className='w-full h-full object-cover cursor-pointer' src={userData?.profileImage || assets.avataricon} alt="" />
            </div>
        </div>
    )
}

export default Nav
