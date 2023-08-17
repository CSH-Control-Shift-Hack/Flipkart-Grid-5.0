import React, { useContext, createContext } from "react";
import { ethers } from "ethers";
import projectFactory from "../artifacts/contracts/Loyalty.sol/ECommerceLoyalty.json";

// 0x44eb92EA9164B24B2eeE88Ef8F697076668D9096

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    "0x44eb92EA9164B24B2eeE88Ef8F697076668D9096", // needs to be changed every time
    projectFactory.abi,
    signer
  );

  const registerSeller = async () => {
    
    const projectData = await contract.registerSeller();
  };

  const addProduct = async (_name, _quantity, _price, _rewardPoints, _loyaltyTokensAccepted, _imageUrl) => {

    const projectData = await contract.addProduct(_name, _quantity, _price, _rewardPoints, _loyaltyTokensAccepted, _imageUrl);
  };

  const purchaseProduct = async (_productIds, _quantities, _fullPaymentInMatic, _totalCost, _totalRewardPoints, _totalLoyaltyTokenUsed) => {

    const projectData = await contract.purchaseProduct(_productIds, _quantities, _fullPaymentInMatic, _totalCost, _totalRewardPoints, _totalLoyaltyTokenUsed);
  };

  const exchangeLRTForMATIC = async (_amount) => {

    const projectData = await contract.exchangeLRTForMATIC(_amount);
  };

  const exchangeMATICForLRT = async () => {

    const projectData = await contract.exchangeMATICForLRT();
  };

  const setLRTToken = async (address) => {

    const projectData = await contract.setLRTToken(address);
  };

  const withdrawTokens = async (_amount) => {

    const projectData = await contract.withdrawTokens(_amount);
  };

  const withdrawMATIC = async (_amount) => {

    const projectData = await contract.withdrawMATIC(_amount);
  };


  return (
    <StateContext.Provider
      value={{
        registerSeller,
        addProduct,
        purchaseProduct,
        exchangeLRTForMATIC,
        exchangeMATICForLRT,
        setLRTToken,
        withdrawTokens,
        withdrawMATIC
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
