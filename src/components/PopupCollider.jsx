import React from 'react'
import '../index.css'
const PopupCollider = ({component, setComponent }) => {



    const handleBackdropClick = (e) => {
       


        if(component.type.name!="Loader"){      
        if (e.target === e.currentTarget) {
          if (typeof setComponent === "function") {
            setComponent(null);
          } 
         
        }
      }
      };

    if (!component) return null; 
  return (
    <div onClick={handleBackdropClick} className='fixed top-0 left-0 w-full h-screen bg-black/20 z-[55] flex justify-center items-center'>
       <div className='max-w-[300px]'>{component}</div> 
    </div>
  )
}

export default PopupCollider