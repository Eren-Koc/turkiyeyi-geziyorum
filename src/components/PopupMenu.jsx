import React, { useContext, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import { MdOutlineFlight } from "react-icons/md";
import { UserContext } from '../context/user-context';
import { FaHome } from "react-icons/fa";
import { PiChatCircleTextFill } from "react-icons/pi";
import { LuTextSearch } from "react-icons/lu";
import { ImProfile } from "react-icons/im";
import PopupCollider from './PopupCollider';
import RandomCity from './RandomCity';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import UserCard from './UserCard';
import Achievements from './Achievements';
import Swal from 'sweetalert2'
import { CiLogin } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";

const PopupMenu = ({popupMenuVisibility,setPopupMenuVisibility}) => {
  const {user,storageLimitOfUser,loading,Logout} = useContext(UserContext); 
  const [activeComponent, setActiveComponent] = useState(null);
  const [traveledCities,setTraveledCities] = useState([]);
  const [allImagesCount,setAllImagesCount] = useState([]);
  const handleButtonClick = (component) => {
    setActiveComponent(() => component);
  };

  useEffect(()=>{
    const handleResize = () => {
      if (window.innerWidth > 1000) { 
        setPopupMenuVisibility(false); 
      }
    };
    window.addEventListener('resize', handleResize); 

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])

  useEffect(()=>{

    if(user && user.posts.length>0){
      const finded =findTraveledCities();
      setTraveledCities(finded);
      const collected = collectionUserAllImages();
      setAllImagesCount(collected);
    }

  },[user])

  const findTraveledCities=()=>{
    let traveledCities = new Set(); 
    const filteredCities = user.posts.map((eachPost) => {
        const city = eachPost.city; 
        if (!traveledCities.has(city)) {
            traveledCities.add(city); 
            return city; 
        }
        return null;
    }).filter(city => city !== null);

    return filteredCities;
  }

  const collectionUserAllImages=()=>{
    let result=0;
    user.posts.map((eachPost)=>{
      result+=eachPost.images.length;
    });
    return result;
  }

  const LoginForm=()=>{
    const form = document.getElementById('login-form');
    form.style.display="flex";     
    
}

  const HandleLogout=()=>{
   Swal.fire({
     
      text: "Çıkış yapmak istediğine emin misin?",
      showDenyButton: true,
      showCancelButton: false,
      icon:"question",
      iconColor:"#2DA15F",
      confirmButtonText: "Çıkış yap",
      confirmButtonColor:"#2DA15F",
      denyButtonColor:"#aaa",
      denyButtonText: `Vazgeç`
    }).then((result) => {
      if (result.isConfirmed) {

          Logout();
          Swal.fire({
            position: "center-center",
            icon: "success",
            text: "Başarıyla çıkış yapıldı.",
            showConfirmButton: false,
            timer: 1000,
          }); 
 
        
      } else if (result.isDenied) {
       
      }
    });

  }
  


  return (
    <div style={{display: popupMenuVisibility ? 'flex' : 'none'}} className='bg-white font-normal text-base shadow-md fixed flex flex-col text-black top-0 left-0 z-[1000] w-full h-fit p-3'>
       <PopupCollider setComponent={setActiveComponent} component={activeComponent}/>
        <IoClose onClick={()=>setPopupMenuVisibility(false)} size={35} className='absolute cursor-pointer top-3 rounded-md right-3 p-1 border '/>
        <span className='text-lg'>Menü</span>

      {user ? (<>
      <div className='flex flex-col gap-2 p-2 mt-4 rounded-lg  border'>
        <div className='w-full flex gap-4 items-center justify-between flex-wrap'>
          <div className='flex gap-2 justify-center w-fit items-center'>
            <img src={user.photoURL} className='w-[24px] h-[24px] rounded-full' alt="" />
            <span>{user.name}</span>
          </div>

            <div className='flex flex-col gap-2 w-fit'>
            
          <div  className= {`flex justify-center items-center gap-1 px-2 py-1 border rounded-xl right-3 text-sm ${user.premium && user ? 'bg-[#7723db]/20 text-[#7723db]' : 'bg-[#2DA15F]/20' } `}>
            
             <span>{Math.floor((storageLimitOfUser - user.storageUsage) * 10) / 10 } MB </span>
             <IoIosInformationCircleOutline title='Kullanılabilir fotoğraf kotanız' className='cursor-pointer' size={16}/>
             </div>
             </div>
        </div>
       {!user.premium ?  <a href='/contact'> <span  className='flex gap-2 mt-2 cursor-pointer bg-[#7723db]/20 text-[#7723db] hover:bg-[#7723db]/30 items-center rounded-md p-[6px]'>
                      <MdOutlineWorkspacePremium size={20}/>
                    Premium'a geç.
                  </span></a> : <span className='text-base font-medium text-[#7723db]'>Premium Kullanıcı</span>}
        </div>
      </>) : null}
      
        <div className='flex text-base flex-col my-4 font-normal gap-4'>
         
         <div className='flex flex-col gap-2 py-1 w-full'>
          <a href="/" className='flex gap-2 px-2 py-1 rounded-lg justify-center hover:bg-[#2DA15F]/20 w-fit items-center'>
            <FaHome size={18}/>
            <span>Anasayfa</span>
          </a>
          <a href="/profile" className='flex gap-2 px-2 py-1 rounded-lg justify-center hover:bg-[#2DA15F]/20 w-fit items-center'>
            <ImProfile size={18}/>
            <span>Profil</span>
          </a>
          <a href="/explore" className='flex gap-2 px-2 py-1 rounded-lg justify-center hover:bg-[#2DA15F]/20 w-fit items-center'>
            <LuTextSearch size={18}/>
            <span>Keşfet</span>
          </a>
          <a href="/contact" className='flex gap-2 px-2 py-1 rounded-lg justify-center hover:bg-[#2DA15F]/20 w-fit items-center'>
            <PiChatCircleTextFill size={18}/>
            <span>İletişim</span>
          </a>
         </div>

       
         

        {user ? (
          <>
            <div className='w-full h-[1px] font-normal max-[500px]:block hidden bg-[#E5E7EB]'></div>
          
          <div className='max-[500px]:flex hidden flex-col gap-2'>
             <span onClick={() => handleButtonClick(<UserCard traveledCities={traveledCities} allImagesCount={allImagesCount} />)} className='flex cursor-pointer gap-2 px-2 py-1 rounded-lg justify-center items-center w-fit hover:bg-[#2DA15F]/20'>
          <FaUserAlt/>
          <span>Profil Kartı</span>
         </span>

         <span onClick={()=>handleButtonClick(<Achievements traveledCities={traveledCities}/>)} className='flex cursor-pointer gap-2 px-2 py-1 rounded-lg justify-center items-center w-fit hover:bg-[#2DA15F]/20'>
          <GrAchievement/>
          <span>Başarımlar</span>
         </span>

         <span onClick={()=>handleButtonClick(<RandomCity traveledCities={traveledCities}/>)} className='flex gap-2 cursor-pointer px-2 py-1 rounded-lg justify-center items-center w-fit hover:bg-[#2DA15F]/20'>
          <MdOutlineFlight/>
          <span>Kader Kurası</span>
         </span>
          </div>
          </>) : null}

        </div>

       <div>
        {
          user ?   <span onClick={()=>{HandleLogout()}} className='flex gap-2 cursor-pointer border hover:bg-[#2DA15F]/20 items-center rounded-md p-[6px]'>
          <IoIosLogOut size={20}/>
          Çıkış Yap
        </span> :   <div onClick={()=>{LoginForm()}} className='max-[500px]:flex hidden cursor-pointer gap-2 items-center p-[6px] rounded-md border'>
            <CiLogin size={20}/>
            <span>Giriş Yap</span>
          </div>
        }
 

        
       </div>
        
        
        
    </div>
  )
}

export default PopupMenu