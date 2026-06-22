import React from 'react'
import Navbar from '../components/Navbar'
import page404 from  "../assets/404_page-not-found.png"

const NotFound = () => {
  return (
    <>
   <Navbar className="" /> 
      <div className="h-full flex items-center justify-center overflow-hidden">
        <img src={page404} alt="not-found" className="w-3/4 h-auto object-cover" />
      </div>
    </>
  )
}

export default NotFound