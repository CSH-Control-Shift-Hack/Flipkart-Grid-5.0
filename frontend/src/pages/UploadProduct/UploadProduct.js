import React , {useState , useRef} from "react";
import Navbar from "../../components/Navbar";
import axios from 'axios'
import { useStateContext } from "../../context";
import { ethers } from "ethers";

function UploadProduct() {

  const name = useRef();
  const quantity = useRef()
  const price = useRef()
  const rewardPoints = useRef()
  const loyaltyTokens = useRef()
  const desc = useRef()
  const img = useRef()

  const { addProduct, contract, loyaltyTokenContract } = useStateContext();

    const addAProduct = async () => {

      let _price = price.current.value
      let _rewardPoints = rewardPoints.current.value
      let _loyaltyTokens = loyaltyTokens.current.value
      let _quantity = quantity.current.value;

        let _priceInEther = ethers.utils.parseEther(_price);
        let _rewardPointsInEther = ethers.utils.parseEther(_rewardPoints);
        let _loyaltyTokensInEther = ethers.utils.parseEther(_loyaltyTokens);

       let approvalTokens = parseFloat(_rewardPoints) * parseFloat(_quantity);

    try {
        const transaction = await loyaltyTokenContract.approve(contract.address, ethers.utils.parseEther(approvalTokens.toString()));
        const transactionReceipt = await transaction.wait();
        
        const data = await addProduct(name.current.value, desc.current.value, _quantity,_priceInEther, 
      _rewardPointsInEther, 
      _loyaltyTokensInEther, img.current.value);
        console.log(data)
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-slate-100 flex flex-col justify-center min-h-[80vh] 2xl:pl-96 2xl:pr-96 xl:pl-64 xl:pr-64 lg:pl-44 lg:pr-44 md:pl-28 md:pr-28 sm:pl-10 sm:pr-10 pl-2 pr-2 pt-16 pb-16">
        <h2 className="font-semibold sm:text-2xl xs:text-xl text-lg">
          Add A Product
        </h2>
        <div className="mt-3">
          <h4 className="font-semibold mb-1 mt-5">Product Name* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <input
              type="text"
              ref={name}
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter a name for your product *"
            />
          </div>
          <h4 className="font-semibold mb-1 mt-5">Product Image* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <input
              type="text"
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter image URL for your product *"
              ref={img}
            />
          </div>
          <h4 className="font-semibold mb-1 mt-5">Product Price* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <input
              type="number"
              ref={price}
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter a price for your product *"
            />
          </div>
          <h4 className="font-semibold mb-1 mt-5">Product Quantity* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <input
              type="number"
              ref={quantity}
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter no. of items to be sold *"
            />
          </div>
          <h4 className="font-semibold mb-1 mt-5">Reward Points* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <input
              type="number"
              ref={rewardPoints}
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter reward points you are offering *"
            />
          </div>
          <h4 className="font-semibold mb-1 mt-5">Loyalty Tokens Accepted* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <input
              type="number"
              ref={loyaltyTokens}
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter loyalty tokens you can accept *"
            />
          </div>
          <h4 className="font-semibold mb-1 mt-5">Product Description* </h4>
          <div className="border-[1px] border-slate-600 p-3">
            <textarea
            rows={4}
              ref={desc}
              className="w-full bg-transparent pt-1 pb-1 placeholder:text-slate-600 placeholder:text-sm focus:outline-0"
              placeholder="Enter a short description for your product *"
            />
          </div>
          <h3
            onClick={addAProduct}
            className="pt-3 pb-3 cursor-pointer mt-7 mb-5 w-[100px] text-center text-slate-100 rounded bg-[#3857df]"
          >
            Create
          </h3>
        </div>
      </div>
    </div>
  );
}

export default UploadProduct;
