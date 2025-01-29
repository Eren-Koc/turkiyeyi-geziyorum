import React, { useContext, useEffect, useState } from 'react'
import { IoMenu } from "react-icons/io5";
import { UserContext } from '../context/user-context';
import antalya from '../images/antalya.jpg';
import { IoIosLogOut } from "react-icons/io";
import { AiOutlineProfile   } from "react-icons/ai";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import Logo from '../images/turkiyeyi-geziyorum-logo.png';
import Swal from 'sweetalert2'
import PopupMenu from './PopupMenu';
const Header = ({props}) => {
  const {user,loading,Logout,storageLimitOfUser} = useContext(UserContext);
  const [currentPage,setCurrentPage]=useState([
   {name:"Anasayfa", href:"/"},
   {name:"Profil", href:"/profile"},
   {name:"Keşfet", href:"/explore"},
   {name:"İletişim", href:"/contact"},
  ]);

  const activePage = (navigation) => {
    return navigation === props ? "active-state" : "";
  };
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

  const [popupMenuVisibility,setPopupMenuVisibility] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const LoginForm=()=>{
    const form = document.getElementById('login-form');
    form.style.display="flex";     
    
}

 
if(loading){
  return <div>Yükleniyor</div>
}

  return (
    <header className={`w-full fixed z-40 top-0 left-0  flex justify-center items-center   h-16 ${isScrolled ? 'bg-black/40 backdrop-blur-sm shadow-md' : null}`}>
      <nav className='flex font-medium  w-full  px-64 max-[1400px]:px-8 text-lg text-slate-200 justify-between max-[1000px]:px-4 items-center'>
        <a href="/" className='mr- flex w-fit justify-center items-center gap-2'>
          <img src={Logo} className='h-[40px] max-[600px]:h-[30px] w-auto' alt="" />
          <span className=' text-slate-200 font-medium'>Türkiyeyi Geziyorum</span>
        </a>
      <div className='flex gap-16 max-[1000px]:hidden items-center'>

        {currentPage.map((eachNavigation)=>{
          return <a className={`${activePage(eachNavigation.name)} `} key={"Header-"+eachNavigation.name} href={eachNavigation.href}>{eachNavigation.name}</a>
        })

        }
      {/* <a href="/">Anasayfa</a>
      <a href="/profile">Profil</a>
      <a href="/explore">Keşfet</a>
      <a href="/contact">İletişim</a> */}
      
      </div>
     
     <div className='flex gap-4 items-center'>
     
     {
      user ?   <div className='w-[200px] relative group hover:bg-white hover:text-black hover:border-none hover:rounded-t-lg hover:rounded-none hover: max-[500px]:hidden   font-semibold  border p-[6px] text-[16px] rounded-lg flex  items-center gap-2'>
      {/* TODO buraya default profil resmi */}
      <div className='group-hover:flex group-hover:rounded-b-lg hidden py-2 absolute text-sm font-medium bg-white  text-black top-[40px] left-0 w-full  '>
        <div className='w-full h-fit gap-2 flex flex-col p-2 rounded-md font-normal'>

        {!user.premium ? 
   <a href='/contact'> <span  className='flex gap-2 mb-2 cursor-pointer bg-[#7723db]/20 text-[#7723db] hover:bg-[#7723db]/30 items-center rounded-md p-[6px]'>
              <MdOutlineWorkspacePremium size={20}/>
            Premium'a geç.
          </span></a> : null  }
<div className='flex flex-col w-full gap-2'>
  
{user.premium && user ?   <span className={`font-medium  ml-2 `}>Premium Kullanıcı</span> : null}
        <div  className={`flex  justify-center items-center gap-1 px-2 py-1 mb-2 rounded-xl text-sm ${user.premium ? 'bg-[#7723db]/20 text-[#7723db]' : 'bg-[#2DA15F]/20 '} `} >
          
           <span>{user ? Math.floor((storageLimitOfUser - user.storageUsage) * 10) / 10 : null} MB </span>
           <IoIosInformationCircleOutline title='Kullanılabilir fotoğraf kotanız' className='cursor-pointer' size={16}/>
           </div>
           
           </div>

        <a href='/profile' className='flex gap-2 cursor-pointer hover:bg-[#2DA15F]/20  items-center rounded-md p-[6px]'>
            <AiOutlineProfile  size={20}/>
            Profil
          </a>

          <span onClick={()=>{HandleLogout()}} className='flex gap-2 cursor-pointer hover:bg-[#2DA15F]/20 items-center rounded-md p-[6px]'>
            <IoIosLogOut size={20}/>
            Çıkış Yap
          </span>


          
        </div>
      </div>
  <img src={user.photoURL ? user.photoURL : antalya} className='w-[28px] h-[28px] object-center object-cover rounded-full' alt="" /> 
      <span className='font-medium'>{user.name}</span>
     </div> : <button  onClick={()=>{LoginForm()}} className=' max-[500px]:hidden px-4 py-2 rounded-2xl border '>Giriş yap</button>
     }
     
     <IoMenu onClick={()=>{setPopupMenuVisibility(true)}} size={25} className='min-[1000px]:hidden cursor-pointer text-white'/>
     <PopupMenu popupMenuVisibility={popupMenuVisibility} setPopupMenuVisibility={setPopupMenuVisibility}/>
     </div>

      </nav>
    </header>
  )
}

export default Header