import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import ProfileCard from "../../components/ProfieCard";
import Card from "../../components/ProductCard";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const [visible, setVisible] = useState(0);

  const nav = useNavigate()
 
  const uploadNav = () => {
    nav("/uploadproduct")
  }

  return (
    <div>
      <Navbar />
      {/* <ProductCard/> */}
      <div className="md:pt-10 md:pb-10 pt-6 pb-6 md:pl-8 md:pr-8 sm:pl-5 sm:pr-5 pl-3 pr-3">
        <h1 className="font-semibold sm:text-4xl text-3xl text-center">
          Your Profile
        </h1>
        <section className="flex justify-center mt-6">
          <div className="flex gap-[10px]">
            <h3
              onClick={() => setVisible(0)}
              className={`pl-4 pr-4 pt-3 pb-3 font-semibold border-[1px] border-slate-500 cursor-pointer ${
                visible === 1 ? "" : "bg-blue-600 text-white"
              }`}
            >
              My Orders
            </h3>
            <h3
              onClick={() => setVisible(1)}
              className={`pl-4 pr-4 pt-3 pb-3 font-semibold border-[1px] border-slate-500 cursor-pointer ${
                visible === 0 ? "" : "bg-blue-600 text-white"
              }`}
            >
              My Products
            </h3>
          </div>
        </section>
        <div className={`md:mt-8 mt-5 ${visible === 0 ? "" : "hidden"}`}>
          <h3 className="text-center font-semibold text-xl">
            FLIPS Available: 5
          </h3>
          <section className="grid lg:grid-cols-2 grid-cols-1 gap-x-[12px] gap-y-[18px] md:mt-8 mt-5">
            <ProfileCard />
            <ProfileCard />
            <ProfileCard />
            <ProfileCard />
            <ProfileCard />
          </section>
        </div>
        <div className={`md:mt-8 mt-5 ${visible === 1 ? "" : "hidden"}`}>
          <div className="flex justify-center gap-[15px]">
            <div className="flex flex-col justify-center">
              <h3 className="text-center font-semibold text-xl">
                FLIPS Available: 5
              </h3>
            </div>
            <h3 onClick={uploadNav} className="text-center font-semibold cursor-pointer pl-3 pr-3 pt-2 pb-2 border-[1px] border-slate-500">
              Add New Product
            </h3>
          </div>
          <section className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-x-[12px] gap-y-[18px] md:mt-8 mt-5">
            <Card />
            <Card />
            <Card />
            <Card />
            <Card />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
