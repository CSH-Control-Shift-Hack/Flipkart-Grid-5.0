import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import LeaderBoardCard from "../../components/LeaderBoardCard";
import { useStateContext } from "../../context";
import { ethers } from "ethers";

function Exchange() {

  const { contract, loyaltyTokenContract, exchangeMATICForLRT, exchangeLRTForMATIC } = useStateContext();

  const [amount, setAmount] = useState(0)
  const [mode, setMode] = useState(0); // 0 -> matic to flip, 1 -> flip to matic

  const convert = async (e) => {

      e.preventDefault();

      try {
          if(!mode) {
            await exchangeMATICForLRT(amount);
          } else {
            await loyaltyTokenContract.approve(contract.address, ethers.utils.parseEther(amount.toString()));
            await exchangeLRTForMATIC(amount);
          }
          
      } catch (e) {
        console.log("error in exchange")
        console.log(e);
      }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-slate-100 flex flex-col justify-center min-h-[92vh] 2xl:pl-96 2xl:pr-96 xl:pl-64 xl:pr-64 lg:pl-44 lg:pr-44 md:pl-28 md:pr-28 sm:pl-10 sm:pr-10 pl-2 pr-2 pt-16 pb-16">
        <h2 className="font-semibold text-center sm:text-3xl xs:text-2xl text-xl">
          Exchange Tokens
        </h2>

        <div className="container mx-auto h-full flex justify-center items-center">
        <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl mb-4 text-gray-700 font-semibold">Currency Exchange</h1>
            
            <div className="mb-4">
                <span className="text-gray-700 text-sm font-bold">Mode of Exchange</span>
                <div className="mt-2">
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio" name="exchangeMode" value="MATICtoFLIP" checked={!mode} onChange={() => setMode(0)} />
                        <span className="ml-2">Convert MATIC to FLIP</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="radio" className="form-radio" name="exchangeMode" value="FLIPtoMATIC" checked={mode} onChange={() => setMode(1)} />
                        <span className="ml-2">Convert FLIP to MATIC</span>
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                    Amount
                </label>
                <input type="number" id="amount" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter Amount" value={amount} onChange={(e) => setAmount(e.target.value) }  />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="convertedAmount">
                    Converted Amount
                </label>
                <input type="text" id="convertedAmount" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Converted Value" value={amount} readOnly/>
            </div>

            <div className="flex items-center justify-between">
                <button onClick={(e) => {
                  convert(e);
                }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                    Convert
                </button>
            </div>
        </div>
    </div>
        
      </div>

    </div>
  );
}

export default Exchange;
