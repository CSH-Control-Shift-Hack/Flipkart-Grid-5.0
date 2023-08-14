import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { changeCurrProduct } from "../actions/index"

function Card(props) {
  
  const nav = useNavigate()
  const dispatch = useDispatch();
 
  const handleNav = () => {
    nav("/productdetails")
  }
  
  return (
    <div onClick={handleNav} className="bg-[#e1ecf1] border-[1px] cursor-pointer border-slate-500 rounded">
      <section className="cursor-pointer">
        <img
          src={
            "https://cdn.pixabay.com/photo/2023/05/15/08/52/flower-7994489_1280.jpg"
          }
          alt="Image"
          className="w-full h-44 rounded-t"
        />
        <div className="pl-3 pr-3 pt-4 pb-4">
          <h2 className="text-lg font-semibold md:leading-5 leading-6">
            Getting Started With Web3 Development
          </h2>
          <h3 className="text-slate-700 mt-2">
            Days after being suspended from Lok Sabha over ...
          </h3>
          <h3 className="mt-4 text-center font-semibold bg-[#c6e7ec] pt-3 pb-3 border-t-[2px] border-slate-400">
            $25
          </h3>
        </div>
      </section>
    </div>
  );
}

export default Card;
