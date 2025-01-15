import React, { useEffect, useState } from 'react'

import { Swiper, SwiperSlide,useSwiper } from 'swiper/react';
import 'swiper/css/virtual';
import { Virtual } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { HiOutlineDownload } from "react-icons/hi";
import '../index.css';
import { IoClose } from "react-icons/io5";
import { EffectCoverflow, Pagination,Navigation } from 'swiper/modules';

const Gallery = ({ images, GalleryVisibility, setGalleryVisibility}) => {
 

  useEffect(() => {
    if (GalleryVisibility) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [GalleryVisibility]);

 

  const swiperFunc = useSwiper();
  const handleClickInside = (event) => {
    event.stopPropagation(); 
  };

  return (
  
    <div  onClick={handleClickInside} style={{ display: GalleryVisibility ? "flex" : "none" }} className='fixed min-h-screen w-full z-[1000] justify-center items-center bg-black/60 top-0 left-0'>
        
        
         <IoClose onClick={() => setGalleryVisibility(null)} className=' absolute top-3 z-50 right-3 cursor-pointer bg-white text-[#2DA15F] w-[35px] h-auto p-1 rounded-md'/>
      
       {images.length>1 ? (
        <Swiper
       
        effect={'coverflow'}
        grabCursor={true}
        loop={true}
        navigation={true}
        
         coverflowEffect={
          {
          rotate:0,
          stretch:0,
          depth:100,
          modifier:2.5,
          slideShadows:false,
 
        }
         }
         pagination={{ clickable: true }}
         centeredSlides={true}
          slidesPerView={1}
          spaceBetween={0}
         modules={[ EffectCoverflow,Pagination,Navigation]}
         className="mySwiper"
       >
         
         {
             images.map((eachImage,i)=>{
                 return <SwiperSlide key={i+"gallery-image"} virtualIndex={i} className='relative' >
              
                  <img className='object-cover  max-w-[80%] max-h-[80vh] max-[500px]:max-w-[90%] max-[500px]:max-h-[90vh]  object-center w-auto h-auto' src={eachImage} key={"swiper-"+i} alt="" />
         
                  
                  </SwiperSlide>
             })
         }
 
 
 
     </Swiper>
       ) : <img className='object-cover  max-w-[80%] max-h-[80vh]  max-[500px]:max-w-[90%] max-[500px]:max-h-[90vh]  object-center w-auto h-auto' src={images[0]}  alt="" />}
       
        

    </div>
  )
}

export default Gallery