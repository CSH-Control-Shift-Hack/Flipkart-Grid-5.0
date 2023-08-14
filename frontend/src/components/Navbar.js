import React from 'react'
import { AiOutlineShoppingCart } from "react-icons/ai"
import { CgProfile } from "react-icons/cg"
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const nav = useNavigate()
 
  const CartNav = () => {
    nav("/cart")
  }

  const ProfileNav = () => {
    nav("/profile")
  }

  const HomeNav = () => {
    nav("/")
  }

  return (
    <div className='pt-3 pb-3 pl-6 pr-6 bg-[#0e16fa] flex justify-between'>
       <section className='flex'>
         <div onClick={HomeNav} className='text-slate-100 text-xl font-semibold cursor-pointer'>Flipkart</div>
       </section>
       <section className='flex'>
          <AiOutlineShoppingCart onClick={CartNav} className='h-8 w-8 text-white ml-3 mr-3 cursor-pointer'/>
          <CgProfile onClick={ProfileNav} className='h-8 w-8 text-white ml-3 mr-3 cursor-pointer'/>
       </section>
    </div>
  )
}

export default Navbar