import React, { useState, useEffect } from "react";
import HistoryCard from "../../components/HistoryCard";
import { Link, useNavigate } from "react-router-dom";

function Rewards({ flipBalance, orderLength }) {
  const nav = useNavigate();

  const uploadNav = () => {
    nav("/rules");
  };

  return (
    <div className="">
      <div className="lg:flex gap-[20px] xl:pl-24 xl:pr-24 lg:pl-16 lg:pr-16 md:pl-12 md:pr-12 sm:pl-6 sm:pr-6 pl-2 pr-2">
        <section className="lg:hidden bg-slate-100 border-[1px] border-slate-500 p-3 h-fit">
          <h2 className="text-slate-600 text-lg pt-2 pb-2 border-b-[1px] border-slate-500">
            REWARDS HISTORY
          </h2>
          <div className="pt-5 pb-5 flex flex-col gap-[12px] pl-3 pr-3 border-b-[1px] border-slate-400">
            <div className="flex justify-between">
              <h3>Total Orders</h3>
              <h3>{orderLength}</h3>
            </div>
          </div>
          <div className="flex text-lg font-semibold justify-between pt-3 pb-3">
            <h3>Total FLIP Balance</h3>
            <h3>{flipBalance}</h3>
          </div>
          <h3
            onClick={uploadNav}
            className="text-center font-semibold cursor-pointer pl-3 pr-3 pt-2 pb-2 border-[1px] border-slate-500"
          >
            Rules for earning FLIPs
          </h3>
        </section>

        <section className="xl:w-1/4 lg:w-5/12 lg:block hidden bg-slate-100 border-[1px] border-slate-500 px-3 mx-auto h-fit">
          <h2 className="text-slate-600 text-lg pt-2 pb-2 border-b-[1px] border-slate-500">
            REWARDS HISTORY
          </h2>
          <div className="pt-5 pb-5 flex flex-col gap-[12px] pl-3 pr-3 border-b-[1px] border-slate-400">
            <div className="flex justify-between">
              <h3>Total Orders</h3>
              <h3>{orderLength}</h3>
            </div>
          </div>
          <div className="flex text-lg font-semibold justify-between pt-3 pb-3">
            <h3>Total FLIP Balance</h3>
            <h3>{flipBalance}</h3>
          </div>
          <h3
            onClick={uploadNav}
            className="text-center font-semibold cursor-pointer pl-3 pr-3 pt-2 pb-2 border-[1px] border-slate-500 my-4"
          >
            Rules for earning FLIPs
          </h3>
        </section>
      </div>
    </div>
  );
}

export default Rewards;
