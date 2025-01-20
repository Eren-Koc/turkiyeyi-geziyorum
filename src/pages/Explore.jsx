import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Header from '../components/Header'
import UserCard from '../components/UserCard'
import { UserContext } from '../context/user-context'
import Achievements from '../components/Achievements'
import Post from '../components/Post'
import { FaUserAlt } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import { MdOutlineFlight } from "react-icons/md";
import ChooseCity from '../components/ChooseCity'
import { MdDateRange } from "react-icons/md";
import { FaCity } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiDoubleQuotesL } from "react-icons/ri";
import { RiDoubleQuotesR } from "react-icons/ri";
import '../index.css';
import PopupCollider from '../components/PopupCollider'
import Loader from '../components/Loader'
const Explore = () => {
 const getTodayValue=()=>{
   const now = new Date();
   const turkishOffset = 3 * 60 * 60 * 1000; 
   const turkishDate = new Date(now.getTime() + turkishOffset);
   const year = turkishDate.getUTCFullYear();
   const month = String(turkishDate.getUTCMonth() + 1).padStart(2, '0'); 
   const day = String(turkishDate.getUTCDate()).padStart(2, '0');
   const result = `${year}-${month}-${day}`;
   return result;
 
 }



   const [today,setToday]=useState(getTodayValue());
  const zeroPoint = new Date('1938-11-10').toISOString().split("T")[0];
  const {user,loading,publicPosts} =useContext(UserContext);
  const [traveledCities,setTraveledCities] = useState([]);
  const [allImagesCount,setAllImagesCount] = useState(0);
  const [selectedCity,setSelectedCity] = useState("Şehir Seçiniz.");
  const defaultBanner="https://firebasestorage.googleapis.com/v0/b/travel-app-93279.firebasestorage.app/o/banners%2Fbg.jpg?alt=media&token=4d137226-bac0-4d4a-a631-a435a2770975";
  const [firstSelectedDate, setFirstSelectedDate] = useState();
  const [secondSelectedDate, setSecondSelectedDate] = useState(today);
  const [dateFilter,setDateFilter]=useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const scrollLoadPer=5;
  const [itemsToShow, setItemsToShow] = useState(scrollLoadPer);
 

  const filteredPosts = useMemo(() => {

    return publicPosts.filter(post => {
      const postDate = new Date(post.create_date); 
  
     
      const isDateInRange = 
        (!firstSelectedDate || !secondSelectedDate) || 
        (postDate >= new Date(firstSelectedDate) && postDate <= new Date(secondSelectedDate));
  
 
      const isCityMatch = selectedCity === "Şehir Seçiniz." || post.city === selectedCity;
  
      return isDateInRange && isCityMatch;
    });
  }, [publicPosts, firstSelectedDate, secondSelectedDate, selectedCity]);

  const visibleFilteredPosts = useMemo(
    () => filteredPosts.slice(0, itemsToShow),
    [filteredPosts, itemsToShow]
  );

  

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      const isMorePostsAvailable = itemsToShow < filteredPosts.length;
  
    
      if (isAtBottom && isMorePostsAvailable) {
      
        setItemsToShow((prev) => Math.min(prev + scrollLoadPer, filteredPosts.length));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [itemsToShow, filteredPosts.length, scrollLoadPer]);
  

  const validateDates = () => {
    if (firstSelectedDate && secondSelectedDate) { 
    
      if (firstSelectedDate < zeroPoint || secondSelectedDate < zeroPoint) {
      
        setFirstSelectedDate(""); 
        setSecondSelectedDate(today);
        setDateFilter(false);
      }
  
      else if (firstSelectedDate > today || secondSelectedDate > today) {
      
        setFirstSelectedDate(""); 
        setSecondSelectedDate(today); 
        setDateFilter(false);
      } 
     
      else if (firstSelectedDate >= secondSelectedDate) {
 
        setFirstSelectedDate(""); 
        setSecondSelectedDate(today); 
        setDateFilter(false);
      } 
      else{
        setDateFilter(true);
      }
    }
  };

  useEffect(() => {
  
    if (firstSelectedDate && secondSelectedDate) {
      validateDates();
    }
  }, [firstSelectedDate, secondSelectedDate]);

  useEffect(()=>{

    if(!loading){

      let allimagenumber=0;
      let travelcities=[];
      if(user && user.posts.length>0){

        user.posts.map((eachPost,i)=>{
  
            if (!travelcities.includes(eachPost.city)) {
              travelcities.push(eachPost.city);
            }

            allimagenumber+=eachPost.images.length;

        })
  
      }
      setTraveledCities(travelcities);
      setAllImagesCount(allimagenumber);

    }

  },[user])

  const handleButtonClick = (component) => {
    setActiveComponent(() => component);
  };

  const formatDate=(date)=> {
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
  }

  const deleteDateFilter=()=>{
    setFirstSelectedDate("");
    setSecondSelectedDate(today);
    setDateFilter(false);
  }


 
  if(loading){
    return <PopupCollider component={<Loader size={60}/>}/>
  }

  return (
    <div className='w-full  items-start min-h-screen h-fit flex flex-col gap-4'>
      <Header props={"Keşfet"}/>
      <PopupCollider setComponent={setActiveComponent} component={activeComponent}/>
      <div className=' relative flex pb-8 justify-center items-end z-0 w-full h-[30vh] object-cover object-center  '>
            <img src={user ? user.bannerURL : defaultBanner} className='w-full absolute top-0 left-0 object-cover h-[30vh]  object-center' alt="" />
            <div className='absolute w-full z-10 top-0 left-0 h-full bg-black/20'></div>
      <div className='absolute z-20 justify-center px-2  text-center items-center text-white font-semibold  gap-10 flex flex-col'>
        <span className='font-medium w-fit text-3xl gap-1 flex  max-[400px]:text-2xl text-[#E2E8F0]  '>
          <RiDoubleQuotesL size={18}/>
          <span className='deneme'>İyi bir gezginin sabit planı ve varmaya niyeti yoktur.</span>
          <RiDoubleQuotesR size={18}/>
          </span>
        <span className='font-semibold text-3xl max-[400px]:text-2xl'>Keşfet</span>
      </div>

        </div>
      
      <div className='w-full flex max-[1050px]:gap-2 gap-12 max-[900px]:flex-col h-fit justify-center max-[900px]:items-center '>
      <div className="sticky top-20 z-10 max-[900px]:top-0 max-[900px]:static max-[900px]:h-fit max-[900px]:w-full max-[900px]:border-none max-[900px]:max-w-none max-[900px]:flex-row max-[900px]:flex-wrap max-[520px]:flex-col-reverse max-[900px]:px-2 max-[900px]:items-center max-[900px]:justify-center max-w-[300px] border-r pr-6 h-[calc(100vh-5rem)]  gap-3 flex flex-col">
        <span className='my-1 max-[900px]:hidden pl-4 font-medium'>Filtreler</span>
        
    
        <div  className='flex gap-8 max-[900px]:border max-[520px]:w-full max-[900px]:px-2 max-[900px]:py-1 max-[900px]:h-10 max-[900px]:gap-2 px-4 py-2 rounded-md hover:bg-[#2DA15F]/20 cursor-pointer justify-center items-center w-fit'>
         <FaCity className='w-[24px] h-[24px]'/>
         <ChooseCity style={'h-[30px] outline-none cursor-pointer max-[520px]:flex-1 bg-transparent appearance-none border-[#CBD5E1] rounded-lg'} selectedCity={selectedCity} setSelectedCity={setSelectedCity}/>
         
         </div>

         <div className='flex gap-6 px-4 py-2 rounded-md max-[520px]:w-full max-[900px]:border max-[900px]:h-10 max-[900px]:px-2 max-[900px]:py-1 max-[900px]:gap-2  justify-center items-center w-fit'>

         <MdDateRange className='w-[24px] h-[24px] max-[900px]:hidden'/>  
         <div className='flex flex-col max-[900px]:flex-row  gap-2'>
         
         <span   className='relative outline-none py-1 px-2 cursor-pointer w-[120px] max-[900px]:text-center h-[24px]  rounded-md flex gap-2 justify-center items-center'>
         <span className='pointer-events-none w-full h-full absolute outline-none z-20 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  select-none'>{firstSelectedDate ? formatDate(firstSelectedDate) : 'Tarih Seç'  }</span>
         <input type="date" value={secondSelectedDate}  min={zeroPoint} onChange={(e) => setFirstSelectedDate(e.target.value)} max={today} className=' explore-date absolute outline-none w-full z-10 top-0 left-0'/>
         </span>
         <MdDateRange className='w-[24px] h-[24px] max-[900px]:block hidden'/>  
         <span   className='relative outline-none py-1 px-2 cursor-pointer w-[120px] max-[900px]:text-center h-[24px]  rounded-md flex gap-2  justify-center items-center'>
         <span className='pointer-events-none w-full h-full absolute outline-none z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none'>{secondSelectedDate ? formatDate(secondSelectedDate) : 'Tarih Seç'  }</span>
         <input type="date" value={secondSelectedDate}  min={zeroPoint} onChange={(e) => setSecondSelectedDate(e.target.value)} max={today} className=' explore-date absolute outline-none w-full z-10 top-0 left-0'/>
         </span>

         </div>
         </div>
       
         <span className='my-1 max-[900px]:hidden pl-4 font-medium'>Menü</span>

        <div onClick={() => handleButtonClick(<UserCard traveledCities={traveledCities} allImagesCount={allImagesCount} />)} className='flex max-[900px]:hidden gap-8 px-4 py-2 rounded-md hover:bg-[#2DA15F]/20 cursor-pointer justify-center items-center w-fit'>
         <FaUserAlt className='w-[24px] h-[24px]'/>
         <span>Profil</span>
         </div>
         <div onClick={() => handleButtonClick(<Achievements traveledCities={traveledCities} allImagesCount={allImagesCount}/>)} className='flex max-[900px]:hidden gap-8 px-4 py-2 rounded-md hover:bg-[#2DA15F]/20 cursor-pointer justify-center items-center w-fit'>
         <GrAchievement className='w-[24px] h-[24px]'/>
         <span>Başarımlar</span>
         </div>
         <a href="/profile">
         <div className='flex max-[900px]:hidden gap-8 px-4 py-2 rounded-md hover:bg-[#2DA15F]/20 cursor-pointer justify-center items-center w-fit'>
         <MdOutlineFlight className='w-[24px] h-[24px]'/>
         <span>Kader Kurası</span>
         
         </div></a>
       
         <input type="submit" value={"Gönderi Ekle"} className='mt-6 h-[40px] max-[900px]:hidden w-full rounded-lg bg-[#2DA15F] text-white font-medium cursor-pointer' />

      </div>
      
      <div className='content max-w-[700px] max-[900px]:px-2 flex flex-col gap-4 w-full max-[900px]:items-center h-fit'>
        
        <div className='filter flex gap-3 w-fit items-center'>
          {selectedCity!="Şehir Seçiniz." || dateFilter ?  <span className=''>Seçili Filtre:</span> : null}
          {selectedCity!="Şehir Seçiniz." ?
          
          
            <span className='px-2 py-1 rounded-xl border flex gap-2 items-center'>
              <span>{selectedCity}</span>
              <IoClose onClick={()=>setSelectedCity("Şehir Seçiniz.")} className='cursor-pointer'/>
            </span>
             
          : null
          }
          {dateFilter ? <span className='px-2 py-1 flex gap-2 items-center rounded-xl border'>
           <span> {firstSelectedDate}
            /
            {secondSelectedDate}</span>
            <IoClose onClick={()=>deleteDateFilter()} className='cursor-pointer'/>
          </span> : null}
        </div>
        {visibleFilteredPosts && visibleFilteredPosts?.length>0 ? (visibleFilteredPosts.map((post)=>{
          
          return (
            <div key={post.id} className='flex flex-col'>
            
            <Post props={post} userData={{username:post.username,profilePicture:post.profilePicture}}/>
            </div>
         )
        })) : <div className='bg-[#2DA15F] w-full rounded-lg font-medium flex-col gap-2 py-8 text-center flex justify-center items-center'>
        <span>Hiç gönderi bulunamadı. &#128546; &#128546;</span>
      </div>}
      </div>
      </div>
    </div>
    

  )
}

export default Explore