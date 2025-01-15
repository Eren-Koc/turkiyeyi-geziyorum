import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/user-context'
import { GrAchievement } from "react-icons/gr";

const Achievements = ({traveledCities,allImagesCount}) => {
    const {user,loading} = useContext(UserContext);
    const [completededAchievements,setCompletededAchievements] = useState(0);


    useEffect(() => {
        if (!loading) {
          if (user) {
            let completedCount = 0;
      
            if (user?.posts.length > 0) {
              
              completedCount += 1;
            } 
      
            if (allImagesCount > 9) {
            
              completedCount += 1;
            } 
      
            if (traveledCities.length > 2) {
            
              completedCount += 1;
            } 
      
            if (searchPublicPost()) {
             
              completedCount += 1;
            } 
      
         
            setCompletededAchievements(completedCount);
          }
        }
      }, [user, allImagesCount, traveledCities, loading]);

    const searchPublicPost =()=>{
        const posts = user?.posts || [];
        const hasPublicPost = posts.some(post => post.public === true) || false;
        return hasPublicPost;
    } 

  
    


  return (
    
    <div className='p-4 rounded-lg flex flex-col text-sm gap-4 min-h-[200px] w-full bg-slate-100'>
    <span className='text-lg flex justify-between w-full items-center font-medium'>Başarımlar <span className='text-sm p-2 rounded-full bg-white text-[#2DA15F]'>{completededAchievements}/4</span></span>
    <div className='max-h-[200px]  w-full flex flex-col gap-2 overflow-y-auto'>

      <div className='flex p-2 rounded-2xl items-center bg-white  w-full gap-2'>
        <GrAchievement size={20}  style={{color: user?.posts.length > 0 ? '#2DA15F' : '#E2E8F0' }} className='text-[#2DA15F]'/>
        <span>1 gönderi yükle</span>
      </div>

      <div className='flex p-2 rounded-2xl items-center bg-white  w-full gap-2'>
        <GrAchievement size={20} style={{color: allImagesCount > 9 ? '#2DA15F' : '#E2E8F0'}}/>
        <span>10 fotoğraf ekle.</span>
      </div>

      <div className='flex p-2 rounded-2xl items-center bg-white  w-full gap-2'>
        <GrAchievement size={20} style={{color: traveledCities.length > 2 ? '#2DA15F' : '#E2E8F0'}}/>
        <span>3 şehir gez.</span>
      </div>
      
      <div className='flex p-2 rounded-2xl items-center bg-white  w-full gap-2'>
        <GrAchievement size={20} style={{color: searchPublicPost() ? '#2DA15F' : '#E2E8F0' }} className='text-slate-200'/>
        <span>Herkese açık 1 gönderi paylaş.</span>
      </div>

     
    </div>
  </div>
  )
}

export default Achievements