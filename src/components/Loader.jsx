import React from 'react'
import '../index.css';
const Loader = ({size}) => {
  return (

       <div style={{
        width: `${size}px`,
        height: `${size}px`,
      }} className={`spinner`}></div>

  )
}

export default Loader