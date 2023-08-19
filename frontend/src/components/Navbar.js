import React, { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaExchangeAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";

import { useStateContext } from '../context/index';

function Navbar() {
  const nav = useNavigate();
  const { connectToMetaMask, isConnected, currentAccount } = useStateContext();

  const CartNav = () => {
    nav("/cart");
  };

  const ExchangeNav = () => {
    nav("/exchange");
  }

  const ProfileNav = () => {
    nav("/profile");
  };

  const LeaderBoardNav = () => {
    nav("/leaderboard");
  };

  const HomeNav = () => {
    nav("/");
  };

  return (
    <div className="pt-3 pb-3 pl-6 pr-6 bg-[#0e16fa] flex justify-between">
      <section className="flex">
      <div className="flex flex-col justify-center">
        <div
          onClick={HomeNav}
          className="text-slate-100 text-xl font-semibold cursor-pointer"
        >
          Flipkart
        </div>
      </div>
      </section>
      <section className="flex">
        <div className="flex flex-col justify-center mr-3">
          <h3 onClick={LeaderBoardNav} className="pt-2 pb-2 pl-3 pr-3 cursor-pointer bg-slate-200 text-slate-800 rounded">
            Leaderboard
          </h3>
        </div>
        <div className="flex flex-col justify-center mr-3">
          <AiOutlineShoppingCart
            onClick={CartNav}
            className="h-8 w-8 text-white ml-3 mr-3 cursor-pointer"
          />
        </div>
        <div className="flex flex-col justify-center mr-3">
          <FaExchangeAlt
            onClick={ExchangeNav}
            className="h-8 w-8 text-white ml-3 mr-3 cursor-pointer"
          />
        </div>
        <div className="flex flex-col justify-center mr-3">
        {
          !isConnected ? (
            <div className="flex flex-col justify-center">
            <button className="pt-2 pb-2 pl-3 pr-3 border-[1px] border-slate-200 text-slate-100" onClick={connectToMetaMask}>Connect to MetaMask</button>
            </div>
          ) : (
            <CgProfile
              onClick={ProfileNav}
              className="h-8 w-8 text-white ml-3 mr-3 cursor-pointer"
            />
          )
        }
        </div>
      </section>
    </div>
  );
}

export default Navbar;
