import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotExist = () => {
  const navigate=useNavigate();

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <div className='flex flex-col gap-4 justify-center items-center w-fit flex-wrap'>
        <span className='font-medium text-lg text-center'>Böyle bir sayfa bulunamadı... <br /> &#128546; &#128546; &#128546;</span>
        <div onClick={()=>{navigate("/")}} className='px-4 py-2 rounded-md cursor-pointer bg-[#2DA15F] text-white font-medium '>Anasayfaya dön</div>
      </div>
    </div>
  )
}

export default NotExist