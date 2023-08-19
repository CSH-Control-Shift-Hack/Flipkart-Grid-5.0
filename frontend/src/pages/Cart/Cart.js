import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import CartCard from "../../components/CartCard";
import { useStateContext } from '../../context/index';
import { ethers } from "ethers";

function Cart() {

  const { contract, purchaseProducts } = useStateContext();

  const [items, setItems] = useState(JSON.parse(localStorage.getItem("flipkart")));
  const [totalPrice, setTotalPrice] = useState(0);
  const [payableInFlips, setPayableInFlips] = useState(0);
  const [loading, setLoading] = useState(false);

  const [productIds, setProductIds] = useState([])
  const [quantities, setQuantities] = useState([])
  const [fullPaymentInMatic, setFullPaymentInMatic] = useState([])

  useEffect(() => {

    let totalCost = 0, totalLoyaltyTokensUsed = 0;

    for(let i = 0; i < items.length; i++) {
      let currProduct = items[i].product;
      let currQuantity = items[i].quantity;
      let currFullPaymentInMatic = items[i].fullPaymentInMatic

      productIds.push(currProduct.productId)
      quantities.push(currQuantity)
      fullPaymentInMatic.push(currFullPaymentInMatic)

       if (currFullPaymentInMatic) {
        totalCost += ethers.utils.formatEther(currProduct.price.toString()) * currQuantity;
      } else {
        // If the product is not fully paid in Matic, 
        // add the remaining cost after using loyalty tokens to totalCost
        totalCost += ethers.utils.formatEther((currProduct.price - currProduct.loyaltyTokensAccepted).toString()) * currQuantity;
        
        // Add the amount of loyalty tokens used for this product to totalLoyaltyTokensUsed
        totalLoyaltyTokensUsed += ethers.utils.formatEther(currProduct.loyaltyTokensAccepted.toString()) * currQuantity;
      }
    }

    setTotalPrice(totalCost)
      setPayableInFlips(totalLoyaltyTokensUsed)
      
      setProductIds(productIds)
      setQuantities(quantities)
      setFullPaymentInMatic(fullPaymentInMatic)



  }, [items])

  const purchase = async (e) => {
    console.log(fullPaymentInMatic)
    e.preventDefault();

    setLoading(true);

    const transaction = await purchaseProducts(productIds, quantities, fullPaymentInMatic, ethers.utils.parseEther(totalPrice.toString()), ethers.utils.parseEther(payableInFlips.toString()));

    console.log("Products purchased!")

    setLoading(false);

  };
  
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
              <h3>Price {`(${items.length} Items)`}</h3>
              <h3>{totalPrice} MATIC</h3>
            </div>
            <div className="flex justify-between">
              <h3>FLIPS Available</h3>
              <h3>{payableInFlips}</h3>
            </div>
          </div>
          <div className="flex text-lg font-semibold justify-between pt-3 pb-3">
            <h3>Total MATIC payable</h3>
            <h3>{totalPrice - payableInFlips} MATIC</h3>
          </div>
          <h2 onClick={(e) => {
            purchase(e);
          }}  className="text-center pt-3 pb-3 mt-1 border-[1px] border-slate-500 cursor-pointer">
            Proceed
          </h2>
        </section>
        <section className="xl:w-3/4 lg:w-7/12 lg:mt-0 mt-6">
          <div className="grid grid-cols-1 gap-[10px]">

          {items?.map((item, index)=>{
            return(
              <CartCard item={item} key={index} />
            )
          })}
          </div>
        </section>
        <section className="xl:w-1/4 lg:w-5/12 lg:block hidden bg-white p-3 h-fit">
          <h2 className="text-slate-600 text-lg pt-2 pb-2 border-b-[1px] border-slate-500">
            PRICE DETAILS
          </h2>
          <div className="pt-5 pb-5 flex flex-col gap-[12px] pl-3 pr-3 border-b-[1px] border-slate-400">
          <div className="flex justify-between">
              <h3>Price {`(${items.length} Items)`}</h3>
              <h3>{totalPrice} MATIC</h3>
            </div>
            <div className="flex justify-between">
              <h3>FLIPS Available</h3>
              <h3>{payableInFlips}</h3>
            </div>
          </div>
          <div className="flex text-lg font-semibold justify-between pt-3 pb-3">
            <h3>Total MATIC payable</h3>
            <h3>{totalPrice - payableInFlips} MATIC</h3>
          </div>
          <h2 onClick={(e) => {
            purchase(e);
          }}  className="text-center pt-3 pb-3 mt-1 border-[1px] border-slate-500 cursor-pointer">
            Proceed
          </h2>
        </section>
      </div>
    </div>
  );
}

export default Cart;
