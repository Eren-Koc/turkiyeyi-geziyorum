import React, { useEffect, useRef, useState } from 'react'
import TurkiyeMap from '../components/TurkiyeMap'
import Header from '../components/Header'
import Sinop from '../images/sinop.jpg';
import Antalya from '../images/antalya.jpg';
import Mardin from '../images/mardin.jpg';

import { Autoplay, Pagination,EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-fade';

import anitkabir from '../images/anıtkabir.jpg';
import uzungol from '../images/Uzungol.jpg';
import bg from '../images/bg.jpg';
import bg2 from '../images/bg2.jpg';
import bg4 from '../images/bg4.jpg';
import bg5 from '../images/bg5.jpg';
import bg8 from '../images/bg8.jpg';
import bg9 from '../images/bg9.jpg';
import bg10 from '../images/bg10.jpg';

const Home = () => {

  const [backgroundImages,setBackgroundImages] = useState([
    bg,uzungol,anitkabir,bg8,bg10,bg4,bg2,bg5,bg9
  ]);
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  
    const addPaintToCity=(cityDataIladi)=>{
      
      const city = document.querySelector(`[data-iladi="${cityDataIladi}"]`);
      const path = city.querySelector('path');
            if (path) {
                path.setAttribute('fill', '#2DA15F');
            }

    }
    
    useEffect(()=>{
    
            addPaintToCity("Sinop");
            addPaintToCity("Antalya");
            addPaintToCity("Mardin");
    },[])
    
  return (
    <div className='w-full min-h-screen h-fit'>
   
      <div className='w-full h-screen bg-black/30 z-[5]  fixed'></div>
      <div className='relative landing-bg w-full h-screen'>

      <Swiper
      direction={'vertical'}
      slidesPerView={1}
        spaceBetween={0}
        grabCursor={false}
        centeredSlides={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        effect={'fade'}
        speed={500}
       
      
        modules={[Autoplay,EffectFade]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="home-swiper"
      >
        {backgroundImages.map((eachBG,i)=>{
return <SwiperSlide className='home-swiper-slide' key={"background-image-"+i}><img src={eachBG} className='h-full overflow-hidden w-full object-cover object-center' alt="" /></SwiperSlide>
})}
       
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
        
        <div className='absolute top-16 px-4 max-[960px px-2]: left-0 w-full min-h-[calc(100%_-_4rem)] max-[960px]:flex-col-reverse flex gap-16 justify-center max-[1100px]:justify-normal max-[960px]:justify-center max-[1100px]:gap-4 items-center z-10'>

          <div className='flex p-4 rounded-md gap-4 flex-col justify-start text-white max-w-[600px] max-[960px]:w-full max-[1560px]:w-[350px]'>
          <span className='flex w-fit justify-center  gap-2'>
            <div className='h-[30px] rounded-md w-[6px] mt-2 bg-[#2DA15F]'></div>
            <span className='text-5xl font-semibold max-[1560px]:text-4xl max-[1100px]:text-3xl max-[960px]:text-2xl max-[600px]:text-xl '>Türkiyeyi Geziyorum'a,<span className='text-[#2DA15F]'> Hoşgeldin.</span></span>

         
          </span>
          <div className='mt-6 max-[1560px]:mt-0 flex flex-col gap-6 rounded-md'>
          <span className='ml-3 font-medium text-[##777F88] '>Bu uygulama senin keşif notların olacak. Gezdiğin noktalardaki anılarını sakla, haritanı renklendir. Hemen harekete geç.</span>
          
          <span className='ml-3   font-medium text-[##777F88]'>Giriş yap ve ilk anını ekle...  </span>
          </div>
         <a href="/profile"> <div className='py-3 px-6 max-[960px]:ml-3 mt-4 rounded-lg font-semibold bg-[#2DA15F] text-white w-fit'>Keşfe başla.</div></a>
          </div>

          <div className='w-[750px] max-[960px]:w-[100%]  max-[960px]:max-w-[700px] max-[1300px]:w-[500px] h-fit '>
            <div className='w-full h-full relative'>

              <div className='max-[1300px]:w-[180px] max-[960px]:hidden max-[1300px]:min-h-[101px] max-[1300px]:left-[250px] max-[1300px]:top-[-90px]    absolute z-10  object-contain shadow-md left-[370px] top-[-110px] text-white w-[230px] h-fit min-h-[130px] bg-white p-3 rounded-md flex items-end justify-end'>
              <img className='top-0 left-0 absolute rounded-md w-full h-full object-cover' src={Sinop} alt="" />    
                <span className='font-semibold z-10 text-lg '>Sinop</span>
                <div className="absolute bottom-0 left-0 w-0 h-0 border-t-[20px] border-t-transparent border-l-[20px] border-white"></div>                  
              </div>

              <div className='max-[1300px]:w-[180px] max-[960px]:hidden max-[1300px]:min-h-[101px] max-[1300px]:top-[220px]  absolute z-10 top-[330px]  left-[50px] object-contain shadow-md text-white w-[230px] h-fit min-h-[130px] bg-white p-3 rounded-md flex items-end justify-end'>
              <img className='top-0 left-0 absolute rounded-md w-full h-full object-cover' src={Antalya} alt="" />    
                <span className='font-semibold z-10 text-lg'>Antalya</span>
                <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-b-[20px] border-[white]  border-r-transparent"></div>              
                </div>

                <div className='max-[1300px]:w-[180px] max-[960px]:hidden max-[1300px]:min-h-[101px] max-[1300px]:left-[390px] max-[1300px]:top-[180px] absolute z-10 top-[275px] left-[590px]  object-contain shadow-md  text-white w-[230px] h-fit min-h-[130px] bg-white p-3 rounded-md flex items-end justify-end'>
              <img className='top-0  left-0 absolute rounded-md w-full h-full object-cover ' src={Mardin} alt="" />    
                <span className='font-semibold z-10 text-lg  '>Mardin</span>
                <div className="absolute top-0 left-0 w-0 h-0 border-b-[20px] border-b-transparent border-r-[20px] border-r-transparent border-l-[20px] border-t-[5px] border-white"></div>                  
                </div>

            </div>
          <TurkiyeMap fill={'#e2e8f0'} /> 
          </div>
            

        </div>
      </div>


      <Header props={"Anasayfa"}/>
    
    </div>
  )
}

export default Home