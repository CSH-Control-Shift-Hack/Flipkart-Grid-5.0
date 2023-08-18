import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import CartCard from "../../components/CartCard";

import { useStateContext } from '../../context/index';

function Cart() {

  const [totalPrice, setTotalPrice] = useState(120);
  const [payableInFlips, setPayableInFlips] = useState(12);
  const [loading, setLoading] = useState(false);

  const [productIds, setProductIds] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [fullPaymentInMatic, setFullPaymentInMatic] = useState([]);

  const { contract, purchaseProducts } = useStateContext();

  const purchase = async (e, productIds, quantities, fullPaymentInMatic) => {

    // Calculate totalCost, totalLoyaltyTokenUsed

    let totalCost = 0, totalLoyaltyTokensUsed = 0;

    for (let i = 0; i < fullPaymentInMatic.length; i++) {
      // Add the product price to totalCost if the product is fully paid in Matic
      let productPrice = await contract.products[productIds[i]].price;
      let loyaltyTokensAccepted = await contract.products[productIds[i]].loyaltyTokensAccepted;

      if (fullPaymentInMatic[i]) {
        totalCost += productPrice * quantities[i];
      } else {
        // If the product is not fully paid in Matic, 
        // add the remaining cost after using loyalty tokens to totalCost
        totalCost += (productPrice - loyaltyTokensAccepted) * quantities[i];
        
        // Add the amount of loyalty tokens used for this product to totalLoyaltyTokensUsed
        totalLoyaltyTokensUsed += loyaltyTokensAccepted * quantities[i];
      }
    }

    e.preventDefault();
    setLoading(true);

    const transaction = await purchaseProducts(productIds, quantities, fullPaymentInMatic, totalCost, totalLoyaltyTokensUsed);

    const transactionReceipt = await transaction.wait();

    console.log("Products purchased!")
    console.log(transactionReceipt)

    setLoading(false);

  };
  
  return (
    <div className="bg-slate-100">
      <Navbar />
      <h1 className="font-semibold mt-10 sm:text-4xl text-3xl text-center">
          Your Cart
        </h1>
      <div className="lg:flex gap-[20px] pt-10 pb-10 xl:pl-24 xl:pr-24 lg:pl-16 lg:pr-16 md:pl-12 md:pr-12 sm:pl-6 sm:pr-6 pl-2 pr-2">

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
              <h3>Price {`(${productIds.length} Items)`}</h3>
              <h3>{totalPrice} MATIC</h3>
            </div>
            <div className="flex justify-between">
              <h3>FLIPS Available</h3>
              <h3>{payableInFlips}</h3>
            </div>
          </div>
          <div className="flex text-lg font-semibold justify-between pt-3 pb-3">
            <h3>Total Price</h3>
            <h3>{totalPrice - payableInFlips} MATIC</h3>
          </div>
          <h3 onClick={(e) => {
            purchase(e, productIds, quantities, fullPaymentInMatic);
          }} className="text-center pt-2 pb-2 pl-3 pr-3 cursor-pointer bg-slate-200 text-slate-800 rounded">
            Proceed
          </h3>
        </section>
      </div>
    </div>
  );
}

export default Cart;
