import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import Header from '../components/Header'
import TurkiyeMap from '../components/TurkiyeMap';
import { CiCamera } from "react-icons/ci";

import { IoClose, IoLocation } from "react-icons/io5";
import Post from '../components/Post';
import EnterPost from '../components/EnterPost';
import { UserContext } from '../context/user-context';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserCard from '../components/UserCard';
import Achievements from '../components/Achievements';
import RandomCity from '../components/RandomCity';
import { MdOutlineTravelExplore } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import { MdOutlineFlight } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

import { RiDoubleQuotesL } from "react-icons/ri";
import { RiDoubleQuotesR } from "react-icons/ri";
import PopupCollider from '../components/PopupCollider'
import Loader from '../components/Loader';


const Profile = () => {
  const navigate=useNavigate();
  const {currentUserAuth,user,setCurrentUserAuth,loading,changeImage} = useContext(UserContext);
  const [traveledCities,setTraveledCities] = useState([]);
  const [allImagesCount,setAllImagesCount] = useState(0);
  const [paintedCities,setPaintedCities] = useState([]);
  const [filterDate,setFilterDate] = useState(false);
  const [filterInput,setFilterInput]=useState("");
  const [filterYear,setFilterYear]=useState("");
  const [userAllPosts,setUserAllPosts] = useState([]);
  const [postsUniqueYears,setPostsUniqueYears] = useState([]);
  const [activeComponent, setActiveComponent] = useState(null);
  const fileInputRef = useRef(null);
  useEffect(()=>{

    if(!loading && user){ 
    setUserAllPosts([
      ...user.posts])
      updatePaintedCities();
  }

 
  },[user,loading])

  useEffect(() => {
    if (userAllPosts) {
      const uniqueYears = [...new Set(userAllPosts.map(item => item.create_date.split("-")[0]))]
        .sort((a, b) => b - a); 
      setPostsUniqueYears(uniqueYears);
    }
  }, [userAllPosts]);


  const sortedData = useMemo(() => {
    return [...userAllPosts].sort((a, b) => {
      if (filterDate) {
        return new Date(a.create_date) - new Date(b.create_date); 
      } else {
        return new Date(b.create_date) - new Date(a.create_date);
      }
    });
  }, [filterDate, userAllPosts]);  

  const filteredPosts = useMemo(() => {
  
    if (!filterInput && !filterYear) return sortedData;
  

    let DataArray = sortedData;
  

    if (filterInput) {
      DataArray = DataArray.filter(post =>
        post.city.toLowerCase().includes(filterInput.toLowerCase())
      );
    }
    if (filterYear) {
      DataArray = DataArray.filter(post => post.create_date.split("-")[0] === filterYear);
    }
  
    return DataArray;
  }, [filterInput, filterYear, sortedData]);


  



   

    const handleFileChange=async(event)=>{
      const newFile = event.target.files[0];

      if(newFile){
        handleButtonClick(<Loader/>)
        await changeImage(newFile,user.id,"banner_picture");
        handleButtonClick(null)
      }

    }

  const openForm=()=>{
    const form = document.getElementById('login-form');
    form.style.display="flex";        
}

const addPaintToCity = (cityDataIladi,color) => {
  const city = document.querySelector(`[data-iladi="${cityDataIladi}"]`);
  const paths = city.querySelectorAll('path'); 
  
  if (paths.length > 0) {
    paths.forEach((path) => {
      path.setAttribute('fill', color); 
    });
  }
};

const handleBannerChange=()=>{
  fileInputRef.current.click();
}

const handleCityFilterChange = (event) => {
  const selectedOptionText = event.target.options[event.target.selectedIndex].text;
  selectedOptionText!="Şehir Seçiniz"  ? setFilterInput(selectedOptionText) : setFilterInput("");
  
};

const handleYearFilterChange=(event)=>{
  const selectedOptionText = event.target.options[event.target.selectedIndex].text;
  selectedOptionText!="Yıl Seçiniz"  ? setFilterYear(selectedOptionText) : setFilterYear("");
}





  useEffect(()=>{

    if(!loading){

    if(!currentUserAuth){
      openForm();
      navigate("/");
    } 
    else{
    }

  }
    
  
  },[loading,currentUserAuth])


  const updatePaintedCities=()=>{
    if(user && user.posts.length>0){
      let updatedCities = [];
      let newTraveledCities=[];
      let newAllImagesCount=0;
      user.posts.map((eachPost,i)=>{
        
        

        const cityIndex = updatedCities.findIndex(cityObj => cityObj.city === eachPost.city);
        
        if (cityIndex === -1) {
        
          updatedCities.push({ city: eachPost.city, count: 1 });
        } else {
         
          updatedCities[cityIndex] = {
            ...updatedCities[cityIndex],
            count: updatedCities[cityIndex].count + 1
          };
        }
        
     
        
      if(newTraveledCities.length>0){
        const founded = newTraveledCities.find((eachcity)=>eachcity==eachPost.city);
        if(!founded){
          newTraveledCities.push(eachPost.city);
        }
      }else{
        newTraveledCities.push(eachPost.city);
      }
        
        newAllImagesCount+=eachPost.images.length;
     

      })
      setAllImagesCount(newAllImagesCount);
      setTraveledCities(newTraveledCities);
      setPaintedCities(updatedCities); 
    }
  }


  useEffect(()=>{
    

    paintedCities.map((eachCity,i)=>{
    
       addPaintToCity(eachCity.city,colorLevel(eachCity.count));
    })

  },[paintedCities,userAllPosts])


  const getColor =(city)=>{
    const founded = paintedCities.find((eachCity)=>eachCity.city==city)
    if(founded){
      return colorLevel(founded.count);
    }
  }

  const handleButtonClick = (component) => {
    setActiveComponent(() => component);
  };

  const colorLevel = (level) => {
   
    if(level==1)
      return "#2DA15F";
    if(level==2)
      return "#c8c848";
    if(level==3)
      return "#E4AF5B";
    if(level==4)
      return "#D6ABAB";
    if(level>=5)
      return "#B97373";


    
  };

  

  
   if(loading){
     return <PopupCollider component={<Loader/>}/>
   }

  return (
    <div className='w-full min-h-screen bg-white h-fit flex flex-col items-center '>
         
         <Header props={"Profil"}/>
         <PopupCollider setComponent={setActiveComponent} component={activeComponent}/>
      <div className='relative flex justify-center  pb-6 items-end z-0 w-full h-[30vh] object-cover object-center  '>
      <img src={user ? user.bannerURL : null} className='w-full absolute top-0 left-0 object-cover h-[30vh]  object-center' alt="" />
      <div className='absolute w-full z-10 top-0 left-0 h-full bg-black/20'></div>
      <div className='absolute z-20 justify-center  px-2 items-center text-center text-white font-semibold  gap-10 flex flex-col'>
        <span className='font-medium w-fit text-3xl justify-center gap-1 flex  max-[400px]:text-2xl text-[#E2E8F0]  '>
                  <RiDoubleQuotesL size={18}/>
                  <span className='deneme'>İyi bir gezginin sabit planı ve varmaya niyeti yoktur.</span>
                  <RiDoubleQuotesR size={18}/>
                  </span>
        <span className='font-semibold text-3xl max-[400px]:text-2xl'>Profil</span>
      </div>
 
        <CiCamera size={40} onClick={handleBannerChange} className='text-[#2DA15F] cursor-pointer absolute p-2 bg-slate-100 rounded-full bottom-3 right-3 z-50' />
        <input ref={fileInputRef} onChange={handleFileChange} accept="image/*"  type="file" />

      </div>
  
      
      <div className='w-full py-6 h-fit justify-center  flex gap-12 max-[1100px]:gap-2  '>
       
       <div className='max-[500px]:hidden  hidden text-[#303030] max-[1100px]:flex min-h-[calc(100vh-5rem)]  items-center pl-2 pt-2 h-full sticky top-20 gap-6 flex-col'>
        <FaUserAlt onClick={() => handleButtonClick(<UserCard traveledCities={traveledCities} allImagesCount={allImagesCount} />)} className='w-[20px] cursor-pointer h-[20px] max-[500px]:w-[16px] max-[500px]:h-[16px]'/>
        <GrAchievement onClick={()=>handleButtonClick(<Achievements traveledCities={traveledCities} allImagesCount={allImagesCount}/>)} className='w-[20px] cursor-pointer h-[20px] max-[500px]:w-[16px] max-[500px]:h-[16px]' />
        <MdOutlineFlight onClick={()=>handleButtonClick(<RandomCity traveledCities={traveledCities}/>)} className='w-[24px] h-[24px] max-[500px]:w-[20px] max-[500px]:h-[20px] cursor-pointer'/>
       </div>

        <div className='w-[300px] max-[1100px]:hidden sticky top-20 z-[11] overflow-visible  h-fit gap-4 justify-center items-center flex-col flex'>     
          
           {/* Profile Card */}
         <UserCard traveledCities={traveledCities} allImagesCount={allImagesCount}/>

         <Achievements traveledCities={traveledCities} allImagesCount={allImagesCount}/>
         <RandomCity traveledCities={traveledCities}/>


        </div>

            <div className='flex flex-col max-[1100px]:border-l max-[1100px]:px-2 max-[780px]:w-full  max-w-[700px] h-fit  gap-4'>

              <div className='w-[700px] max-[780px]:w-full flex justify-center items-center flex-col p-3 max-[780px]:p-2 bg-slate-100 rounded-lg'>
              <div className='flex justify-between text-sm gap-2 items-center w-full p-[6px] mb-2 flex-wrap'>
                <div className='gap-2 flex justify-center items-center w-fit'>
              <div className='bg-[#2DA15F] px-2 py-2 rounded-lg'></div>
              <div className='bg-[#c8c848] px-2 py-2 rounded-lg'></div>
              <div className='bg-[#E4AF5B] px-2 py-2 rounded-lg'></div>
              <div className='bg-[#D6ABAB] px-2 py-2 rounded-lg'></div>
              <div className='bg-[#B97373] px-2 py-2 rounded-lg'></div>
              </div>
              <div title='Harita tamamlanma oranı:' className='flex gap-2 px-2 py-[6px] rounded-lg bg-[#2DA15F]/20 justify-center items-center w-fit'>
                <MdOutlineTravelExplore size={20} className=''/>
                <span className=''>{traveledCities ? ((traveledCities.length / 81) * 100).toFixed(2) : 0}%</span>
              </div>
              </div>
              <div className='w-[700px] max-[780px]:w-full p-3 max-[780px]:p-0'>
              <TurkiyeMap paintedCities={paintedCities} user={user} fill={'#303030'}/>
              </div>
              <div className='flex mt-4 bg-slate-100 p-[6px]  rounded-lg items-center gap-3 flex-wrap w-full text-sm'>

              {
                user && traveledCities ? traveledCities.map((city,i)=>{
                  return (
                    <div key={user.id+"traveledcity-"+i} className='flex justify-center cursor-pointer items-center bg-white px-2 py-1 rounded-lg'>
                  <IoLocation className='location-icon max-[780px]:w-[20px] w-[24px] h-auto' style={{color:getColor(city)}}/>
                  <span>{city}</span>
                </div>
                  )
                }) : null
              }
              
              </div>
              </div>
          
              <EnterPost setComponent={setActiveComponent} component={activeComponent} />
              
              <div className='flex w-full items-center max-[650px]:flex-col max-[650px]:items-start justify-between'>
              <span className=' font-semibold text-lg my-2'>Gönderileriniz {user ? "("+ userAllPosts.length+")" :null }</span>
              <div className='flex gap-2 max-[650px]:w-full max-[450px]:flex-col max-[650px]:mt-2 justify-center items-center'>

         
              
              <span className='flex max-[650px]:flex-1 max-[450px]:w-full relative group hover:border-b-0 hover:rounded-b-none gap-2 text-sm border p-2 rounded-md justify-center items-center'>
                <FaFilter/>
                <span>{filterDate ? 'Eskiden Yeniye' : 'Yeniden Eskiye'}</span>
                <div className='group-hover:flex hidden rounded-b p-2 border-b border-x bg-white top-[35px] text-center items-center w-full left-0 h-fit flex-col gap-3 absolute'>
                <span onClick={()=>setFilterDate(false)} style={{display: filterDate ? 'flex' : 'none'}} className='cursor-pointer'>Yeniden Eskiye</span>
                <span onClick={()=>setFilterDate(true)} style={{display: filterDate ? 'none' : 'flex'}} className='cursor-pointer'>Eskiden Yeniye</span>
                </div>
              </span>
              <div className='flex-1 flex gap-2 justify-center items-center'>
              <span className='flex max-[650px]:flex-1 cursor-pointer gap-2 text-sm border p-2 rounded-md items-center'>
            

                <select value={filterInput} onChange={handleCityFilterChange} className='outline-none max-[450px]:w-full px-2 cursor-pointer'>
                <option value="">Şehir Seçiniz</option>
                {
                  traveledCities ? traveledCities.map((eachCity,i)=>{
                    return <option key={eachCity+"-"+i} value={eachCity}>{eachCity}</option>
                  }) : null
                }
                </select>
              </span>
             
           
              <span className='flex max-[650px]:flex-1 cursor-pointer gap-2 text-sm border p-2 rounded-md items-center'>
            

            <select  value={filterYear} onChange={handleYearFilterChange} className='outline-none max-[450px]:w-full px-2 cursor-pointer'>
            <option value="">Yıl Seçiniz</option>
            {
              postsUniqueYears ? postsUniqueYears.map((eachYear,i)=>{
                return <option key={"filter-"+eachYear+"-"+i} value={eachYear}>{eachYear}</option>
              }) : null
            }
            </select>
          </span>
          </div>

              </div>
              </div>
              {filterInput || filterYear ? <div className='flex justify-center items-center gap-2 w-fit text-sm '>
               
               <span className='font-medium'>({filteredPosts.length})</span>
               <span className=''>Sonuç bulundu.</span>
               
             
                
              {
                filterInput ?  <span onClick={()=>{setFilterInput("")}} className='px-2 py-1 border rounded-xl cursor-pointer flex justify-center items-center w-fit gap-2'>
                <span>{filterInput}</span>
                <IoClose/>
              </span>
              : null
              }
              {
                filterYear ?  <span onClick={()=>{setFilterYear("")}} className='px-2 py-1 border rounded-xl cursor-pointer flex justify-center items-center w-fit gap-2'>
                <span>{filterYear}</span>
                <IoClose/>
              </span>
              : null
              }
               
               
                
               
                
              </div> : null}
              <div className='posts-container flex flex-col gap-4'>
                
                {
                  filteredPosts && filteredPosts.length>0 ? (

                    filteredPosts.map((eachPost)=>{
                      return(
                        <Post key={eachPost.id} props={eachPost} setComponent={setActiveComponent} />
                      )
                    })

                  ) : <div className='bg-[#2DA15F] w-full rounded-lg font-medium flex-col gap-2 py-8 text-center flex justify-center items-center'>
                    <span>Hiç gönderi bulunamadı. &#128546; &#128546;</span>
                    {
                      userAllPosts.length>0 ? <div onClick={()=>{setFilterInput(""); setFilterYear("");}} className='cursor-pointer border text-sm border-[#303030] px-2 py-1 rounded-xl'>Tüm filtreleri kaldır</div> : null 
                    }
                  </div>
                }

              </div>
            </div>

      </div>
<ToastContainer />
    </div>
  )
}

export default Profile