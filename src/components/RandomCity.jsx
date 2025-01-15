import React, { useEffect, useRef, useState } from 'react'
import { MdFlightTakeoff } from "react-icons/md";
import { LuPartyPopper } from "react-icons/lu";
import { FaCity } from "react-icons/fa";
import JSConfetti from 'js-confetti'
import successSound from '../images/tada.mp3';
 
const RandomCity = ({traveledCities}) => {

   
    const [currentRegion,setCurrentRegion]=useState("Tüm Bölgeler");
    const [result,SetResult] = useState("");
    const [popupVisibility,setPopupVisibility] = useState(false);
    const jsConfetti = new JSConfetti()
    const popupRef = useRef(null)
    const [showSuccess, setShowSuccess] = useState(false);



    useEffect(() => {
      if (showSuccess) {
     
        const audio = new Audio(successSound);  
        audio.volume = 0.2;
        audio.play();
  
        
        setTimeout(() => {
          setShowSuccess(false);
        }, 1000);  
      }
    }, [showSuccess]);
      
      
    useEffect(() => {
    
        const handleClickOutside = (event) => {
         
          if (popupVisibility && popupRef.current && !popupRef.current.contains(event.target)) {
            setPopupVisibility(false); 
          }
        };
    
      
        document.addEventListener('click', handleClickOutside);
    
       
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, [popupVisibility]); 

const handleClick=(event)=>{

 

    const svgMap = document.getElementById("svg-turkiye-haritasi");
    const regions = svgMap.querySelectorAll( currentRegion=="Tüm Bölgeler" ? "g[data-bolge]"  : `g[data-bolge="${currentRegion}"]`);
    
 
    const cityArray = Array.from(regions).flatMap(region => {
      const cities = region.querySelectorAll("g[data-iladi]");
      return Array.from(cities).map(city => city.getAttribute("data-iladi"));
    });

    const NoVisitedCities = cityArray.filter(city => !traveledCities.includes(city));
    const randomCity = NoVisitedCities[Math.floor(Math.random() * NoVisitedCities.length)];
    
    SetResult(randomCity);
    setShowSuccess(true);
    jsConfetti.addConfetti({
  
      confettiRadius: 6,
      confettiNumber:100,
      confettiColors: [
        '#2DA15F', '#C8C848', '#E4AF5B', '#D6ABAB', '#B97373'
      ],
    })

    event.stopPropagation(); 
    setPopupVisibility(true);


}



const handleChange = (event) => {
    const selectedOptionText = event.target.options[event.target.selectedIndex].text;
    setCurrentRegion(selectedOptionText);
 
  };




  return (
    <   div className='w-full p-4 bg-slate-100 rounded-lg flex flex-col gap-3 '>
        <div style={{display: popupVisibility ? 'flex' : 'none'}} className='bg-black/20 fixed top-0 left-0 z-50 w-full justify-center items-center min-h-screen h-full'>
        <div ref={popupRef}  className='shadow-lg flex flex-col rounded-md items-center gap-3 bg-white text-[#2DA15F] font-medium p-3 px-6  top-1/2 left-1/2 transform '>
       <span className='text-black'>Tebrikler</span>
       <div className='flex justify-start items-center gap-2'>
       <LuPartyPopper className='text-[#2DA15F]' size={30}/>
      
            <span className='text-2xl font-semibold'>{result}</span>
            </div>
        <span className='p-2 bg-white text-sm text-black rounded-md flex gap-1 justify-center items-center'><FaCity size={20}/> {traveledCities.length + 1}. Şehrini buldun.</span>
       
        </div>
        </div>

        <span className='font-medium text-lg'>Kader Kurası</span>
        <div className='text-sm italic  flex flex-col gap-1'>
            <span>Gidilecek bir sonraki durağı mı arıyorsun?</span>
       <span> Bırak kader senin için seçsin.</span>
        </div>

        <select onChange={handleChange} className=' cursor-pointer bg-transparent px-1 py-[6px] border rounded-md outline-none' name="" id="">
            <option value="Tüm Bölgeler">Tüm Bölgeler</option>
            <option value="Karadeniz">Karadeniz</option>
            <option value="Ege">Ege</option>
            <option value="Marmara">Marmara</option>
            <option value="İç Anadolu">İç Anadolu</option>
            <option value="Güneydoğu Anadolu">Güneydoğu Anadolu</option>
            <option value="Doğu Anadolu">Doğu Anadolu</option>

        </select>
   

        <div onClick={handleClick} className='bg-[#2DA15F] mt-2 text-white cursor-pointer font-medium flex justify-center items-center gap-2 py-2 rounded-md'>
            <MdFlightTakeoff size={20} />
            <span>Kura Çek</span>
        </div>
      
    </div>
  )
}

export default RandomCity