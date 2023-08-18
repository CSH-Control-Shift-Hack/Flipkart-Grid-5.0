import React from "react";
import Navbar from "../../components/Navbar";
import CartCard from "../../components/CartCard";

function Cart() {
  
  return (
    <div className="bg-slate-100">
      <Navbar />
      <h1 className="font-semibold mt-10 sm:text-4xl text-3xl text-center">
          Your Cart
        </h1>
      <div className="lg:flex gap-[20px] pt-10 pb-10 xl:pl-24 xl:pr-24 lg:pl-16 lg:pr-16 md:pl-12 md:pr-12 sm:pl-6 sm:pr-6 pl-2 pr-2">
        <section className="lg:hidden bg-white p-3 h-fit">
          <h2 className="text-slate-600 text-lg pt-2 pb-2 border-b-[1px] border-slate-500">
            PRICE DETAILS
          </h2>
          <div className="pt-5 pb-5 flex flex-col gap-[12px] pl-3 pr-3 border-b-[1px] border-slate-400">
            <div className="flex justify-between">
              <h3>Price (4 Items)</h3>
              <h3>120 MATIC</h3>
            </div>
            <div className="flex justify-between">
              <h3>FLIPS Available</h3>
              <h3>12</h3>
            </div>
          </div>
          <div className="flex text-lg font-semibold justify-between pt-3 pb-3">
            <h3>Total Price</h3>
            <h3>108 MATIC</h3>
          </div>
          <h2 className="text-center pt-3 pb-3 mt-1 border-[1px] border-slate-500">
            Proceed
          </h2>
        </section>
        <section className="xl:w-3/4 lg:w-7/12 grid grid-cols-1 gap-[10px] lg:mt-0 mt-6">
          <CartCard />
          <CartCard />
          <CartCard />
          <CartCard />
        </section>
        <section className="xl:w-1/4 lg:w-5/12 lg:block hidden bg-white p-3 h-fit">
          <h2 className="text-slate-600 text-lg pt-2 pb-2 border-b-[1px] border-slate-500">
            PRICE DETAILS
          </h2>
          <div className="pt-5 pb-5 flex flex-col gap-[12px] pl-3 pr-3 border-b-[1px] border-slate-400">
            <div className="flex justify-between">
              <h3>Price (4 Items)</h3>
              <h3>120 MATIC</h3>
            </div>
            <div className="flex justify-between">
              <h3>FLIPS Available</h3>
              <h3>12</h3>
            </div>
          </div>
          <div className="flex text-lg font-semibold justify-between pt-3 pb-3">
            <h3>Total Price</h3>
            <h3>108 MATIC</h3>
          </div>
          <h2 className="text-center pt-3 pb-3 mt-1 border-[1px] border-slate-500">
            Proceed
          </h2>
        </section>
      </div>
    </div>
  );
}

export default Cart;
