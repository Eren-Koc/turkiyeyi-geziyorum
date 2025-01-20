import React from 'react'
import '../index.css';
const Loader = ({size}) => {
  return (
   
       <div className={`spinner w-[${size+'px'}] h-[${size+'px'}]`}></div>
//  60 60
  )
}

export default Loader