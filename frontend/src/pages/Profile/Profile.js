import React, { useState , useEffect } from "react";
import Navbar from "../../components/Navbar";
import ProfileCard from "../../components/ProfileCard";
import Card from "../../components/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import Rewards from "./Rewards";
import { useStateContext } from "../../context";
import { ethers } from "ethers";

function Profile() {
  const [visible, setVisible] = useState(0);
  const [flips, setFlips] = useState(0)

  const nav = useNavigate();

  const uploadNav = () => {
    nav("/uploadproduct");
  };

  const {
    registerSeller,
    registerUser,
    currentAccount,
    getAllProducts,
    contract,
    getUserProducts,
    getUserOrders,
    searchSeller,
    searchUser,
    getLRTOfUser
  } = useStateContext();

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const data = await getUserProducts();
      console.log("user products: ", data);
      setProducts(data);
    } catch (e) {
      console.log("error in fetching user products");
      console.log(e);
    }
  };

  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const data = await getUserOrders();
      console.log("user orders: ", data);
      setOrders(data);
    } catch (e) {
      console.log("error in fetching user orders");
      console.log(e);
    }
  };

  const [isSeller, setIsSeller] = useState([]);

  const sellerSearch = async () => {
    try {
      const data = await searchSeller();
      console.log("seller address:", data?.sellerAddress);
      setIsSeller(data);
    } catch (e) {
      console.log("error in check seller");
      console.log(e);
    }
  };

  const [isUser, setIsUser] = useState([]);

  const userSearch = async () => {
    try {
      const data = await searchUser();
      console.log("user address: ", data?.userAddress);
      setIsUser(data);
    } catch (e) {
      console.log("error in check user");
      console.log(e);
    }
  };

  const fetchLRTOfUser = async () => {
    try {
      const data = await getLRTOfUser();
      console.log("flips received: ", ethers.utils.formatEther(data))
      setFlips(ethers.utils.formatEther(data))
    } catch(e) {
      console.log("error in fetching flips of user");
      console.log(e)
    }
  }


  useEffect(() => {
    if (contract) {
      getProducts();
      getOrders();
      sellerSearch()
      userSearch()
      fetchLRTOfUser()
    }
  }, [contract, currentAccount]);

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
                visible === 0 ? "bg-blue-600 text-white" : ""
              }`}
            >
              My Orders
            </h3>
            <h3
              onClick={() => setVisible(1)}
              className={`pl-4 pr-4 pt-3 pb-3 font-semibold border-[1px] border-slate-500 cursor-pointer ${
                visible === 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              My Products
            </h3>
            <h3
              onClick={() => setVisible(2)}
              className={`pl-4 pr-4 pt-3 pb-3 font-semibold border-[1px] border-slate-500 cursor-pointer ${
                visible === 2 ? "bg-blue-600 text-white" : ""
              }`}
            >
              Rewards
            </h3>
          </div>
        </section>
        <div className={`md:mt-8 mt-5 ${visible === 0 ? "" : "hidden"}`}>
          <div className="flex justify-center gap-[15px]">
            <div className="flex flex-col justify-center">
              <h3 className="text-center font-semibold text-xl">
                FLIPS Available: {flips}
              </h3>
            </div>
            <h3
              onClick={registerUser}
              className={`text-center font-semibold cursor-pointer pl-3 pr-3 pt-2 pb-2 border-[1px] border-slate-500 ${isUser?.userAddress === '0x0000000000000000000000000000000000000000'? '':'hidden'}`}
            >
              Register As User
            </h3>
          </div>
          <section className="grid lg:grid-cols-2 grid-cols-1 gap-x-[12px] gap-y-[18px] md:mt-8 mt-5">
          {
            orders?.map((item, index) => (
              <ProfileCard order={item} />
            ))
          }
          </section>
        </div>
        <div className={`md:mt-8 mt-5 ${visible === 1 ? "" : "hidden"}`}>
          <div className="flex justify-center gap-[15px]">
            <div className="flex flex-col justify-center">
              <h3 className="text-center font-semibold text-xl">
                FLIPS Available: {flips}
              </h3>
            </div>
            <h3
              onClick={uploadNav}
              className={`text-center ${isSeller?.sellerAddress === '0x0000000000000000000000000000000000000000'? 'hidden':''} font-semibold cursor-pointer pl-3 pr-3 pt-2 pb-2 border-[1px] border-slate-500`}
            >
              Add New Product
            </h3>
            <h3
              onClick={registerSeller}
              className={`text-center font-semibold cursor-pointer pl-3 pr-3 pt-2 pb-2 border-[1px] border-slate-500 ${isSeller?.sellerAddress === '0x0000000000000000000000000000000000000000'? '':'hidden'} `}
            >
              Register As Seller
            </h3>
          </div>
          <section className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-x-[12px] gap-y-[18px] md:mt-8 mt-5">
          {products?.map((item, i)=>{
            return(
            <Card key = {i} item={item}/>
            )
          })}
          </section>
        </div>
        <div className={`md:mt-8 mt-5 ${visible === 2 ? "" : "hidden"}`}>
          <Rewards flipBalance={flips} orderLength={orders.length} />
        </div>
      </div>
    </div>
  );
}

export default Profile;
