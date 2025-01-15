import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../context/user-context'
import antalya from '../images/antalya.jpg';
import { SlOptions } from "react-icons/sl";
import { MdLock } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { AiFillPicture } from "react-icons/ai";
import { BsPostcardHeartFill } from "react-icons/bs";
import { FaCity } from "react-icons/fa";
import { CiCamera } from "react-icons/ci";
import PopupCollider from './PopupCollider';
import Loader from './Loader';

const UserCard = ({traveledCities,allImagesCount}) => {

    const {user,loading,changeImage} = useContext(UserContext);
    const fileInputRef = useRef(null);
    const [activeComponent, setActiveComponent] = useState(null);
    const handleFileDialogOpen = () => {
      fileInputRef.current.click(); 
    };

    const handleFileChange= async(event)=>{
      const newFile = event.target.files[0];

      if(newFile){
       
        handleButtonClick(<Loader/>);
        await changeImage(newFile,user.id,"profile_picture");
        handleButtonClick(null);
       
      }

    }

    

    const convertTimestampToDate = (timestamp) => {
      let numbertimestamp = Number(timestamp);
    
      const date = new Date(numbertimestamp); 
    
    
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); 
      const year = date.getFullYear();
    
      return `${day}/${month}/${year}`; 

  

    };
    const handleButtonClick = (component) => {
      setActiveComponent(() => component);
    };
  

    // if(loading){
    //   return <PopupCollider component={<Loader/>}/>
    // }
    

  return (
     <div className='p-4 rounded-lg flex flex-col gap-4 min-h-[280px] w-full bg-slate-100'>
                <div className='relative h-[128px] w-fit'>
                <PopupCollider setComponent={setActiveComponent} component={activeComponent}/>
                <img src={user && user.photoURL ? user.photoURL : antalya} className='rounded-full w-[128px] h-[128px] object-cover' alt="" />
                <CiCamera onClick={()=>handleFileDialogOpen()} size={35}  className='absolute cursor-pointer bottom-1 text-[#2DA15F] right-1 z-20 rounded-full bg-white p-[6px]'/>
                <input ref={fileInputRef} onChange={handleFileChange} accept="image/*"  type="file" />
                </div>
                <div className='flex justify-center text-sm items-start flex-col gap-2'>
                  <span className='text-[16px] mx-2'>Hoşgeldin,  <span className=' font-semibold text-lg'>{user ? user.name : null}</span> </span>
                  <div className='w-full flex flex-wrap gap-[6px] justify-start items-center'>
    
                  <span className='flex w-fit justify-center p-2 rounded-2xl bg-white gap-2 items-center'>
                    <MdDateRange size={20} className='text-[#2DA15F]'/>
                    <span className=''>{user ? convertTimestampToDate(user.createdAt) : null}</span>
                  </span>
    
                  <span className='flex w-fit justify-center p-2 rounded-2xl bg-white gap-2 items-center'>
                    <FaCity size={20} className='text-[#2DA15F]'/> 
                    <span className=''>{traveledCities.length > 0 ? traveledCities.length : 0} Şehir  </span>
                  </span>
    
                  <span className='flex w-fit justify-center p-2 rounded-2xl bg-white gap-2 items-center'>
                    <BsPostcardHeartFill size={20} className='text-[#2DA15F]'/>
                    <span className=''>{user ? user.posts.length : 0} gönderi</span>
                  </span>
    
    
                  <span className='flex w-fit justify-center p-2 rounded-2xl bg-white gap-2 items-center'>
                    <AiFillPicture size={20} className='text-[#2DA15F]'/>
                    <span className=''>{user ? allImagesCount : 0} fotoğraf</span>
                  </span>
              
                  </div>
                </div>
              </div>
  )
}

export default UserCard