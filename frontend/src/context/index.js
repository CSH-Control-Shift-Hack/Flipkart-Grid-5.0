import React, { useContext, createContext } from "react";
import { ethers } from "ethers";
import eCommerceLoyalty from "../artifacts/contracts/Loyalty.sol/ECommerceLoyalty.json";
import loyaltyToken from "../artifacts/contracts/LRT.sol/LoyaltyRewardToken.json";

// 0x44eb92EA9164B24B2eeE88Ef8F697076668D9096

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    "0xae02F2b88BDF6e38A5Ae40EE6A38f66bee53b113", // needs to be changed every time
    eCommerceLoyalty.abi,
    signer
  );

  const registerSeller = async () => {

    const projectData = await contract.registerSeller();
  };

  const registerUser = async () => {
    const projectData = await contract.registerUser()
  }

  const addProduct = async (_name, _desc, _quantity, _price, _rewardPoints, _loyaltyTokensAccepted, _imageUrl) => {

    const projectData = await contract.addProduct(_name, _desc, _quantity, _price, _rewardPoints, _loyaltyTokensAccepted, _imageUrl);

  }

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

  const getAllProducts = async () => {
    console.log("AAJA")
    const projectData = await contract.getAllProducts()

    const AllProducts = projectData.map((product, i) => ({
      description: product.description,
      imageURI: product.imageURI,
      loyaltyTokensAccepted: ethers.utils.formatEther(product.loyaltyTokensAccepted)*1000000000000000000,
      name: product.name,
      price: ethers.utils.formatEther(product.price)*1000000000000000000,
      productId: ethers.utils.formatEther(product.productId)*1000000000000000000,
      quantity: ethers.utils.formatEther(product.quantity)*1000000000000000000,
      rewardPoints: ethers.utils.formatEther(product.rewardPoints)*1000000000000000000,
      sellerAddress: product.sellerAddress,
    }));

    return AllProducts
  }

  const getAllUsers = async () => {
    const projectData = await contract.getLeaderBoard()
    return projectData
  }



  const loyaltyTokenContract = new ethers.Contract(
    "0x2128828f4d34787f79A43b7619046338c26Fef06", // needs to be changed every time
    loyaltyToken.abi,
    signer
  );

  const checkDecay = async(address) => {
    await loyaltyTokenContract.checkDecay(address);
  }

  const issueTokens = async(_to, _amount) => {
    await loyaltyTokenContract.issueTokens(_to, _amount);
  }

  const issueTokensBySeller = async(_to, _amount) => {

    // First check if the sender is a seller

    // Then call the loyalTokenContract.issueTokensBySeller function
    await loyaltyTokenContract.issueTokensBySeller(_to, _amount);

  }


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
        withdrawMATIC,
        getAllProducts,
        getAllUsers,
        registerUser
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);