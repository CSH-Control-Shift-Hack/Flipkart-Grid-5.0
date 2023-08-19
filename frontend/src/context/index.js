import React, { useState, useEffect, useContext, createContext } from "react";
import { ethers } from "ethers";
import eCommerceLoyalty from "../artifacts/contracts/Loyalty.sol/ECommerceLoyalty.json";
import loyaltyToken from "../artifacts/contracts/LRT.sol/LoyaltyRewardToken.json";

const StateContext = createContext();

// These addresses need to be changed every time
const loyaltyAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6"
const lrtAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"

export const StateContextProvider = ({ children }) => {

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const connectToMetaMask = async () => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signerInstance = web3Provider.getSigner();
      const contractInstance = new ethers.Contract(
        loyaltyAddress,
        eCommerceLoyalty.abi,
        signerInstance
      );

      setProvider(web3Provider);
      setSigner(signerInstance);
      setContract(contractInstance);

      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error("User rejected the connect request");
      }

      // Subscribe to accounts change
      window.ethereum.on('accountsChanged', (accounts) => {
        setCurrentAccount(accounts[0]);
      });
    } else {
      console.log("No web3? You should consider trying MetaMask!");
    }
  };

  // Automatically connect to MetaMask if an account is already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            // MetaMask is already connected
            setCurrentAccount(accounts[0]);
            setIsConnected(true);
          }
        });

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signerInstance = web3Provider.getSigner();
      const contractInstance = new ethers.Contract(
        loyaltyAddress,
        eCommerceLoyalty.abi,
        signerInstance
      );

      setProvider(web3Provider);
      setSigner(signerInstance);
      setContract(contractInstance);
    }
  }, []);

  const registerSeller = async () => {

    const projectData = await contract.registerSeller();
  };

  
  const registerUser = async () => {
    const projectData = await contract.registerUser()
  }

  const addProduct = async (_name, _desc, _quantity, _price, _rewardPoints, _loyaltyTokensAccepted, _imageUrl) => {

    const projectData = await contract.addProduct(_name, _desc, _quantity, _price, _rewardPoints, _loyaltyTokensAccepted, _imageUrl);

  }

  const purchaseProducts = async (_productIds, _quantities, _fullPaymentInMatic, _totalCost, _totalLoyaltyTokenUsed) => {

    const projectData = await contract.purchaseProducts(_productIds, _quantities, _fullPaymentInMatic, _totalCost, _totalLoyaltyTokenUsed);
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

  const getUserOrders = async () => {
    console.log("AAJA")
    const projectData = await contract.getUserOrders(currentAccount)

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

  const getUserProducts = async () => {
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

    const final = AllProducts.filter((item)=>item?.sellerAddress.toUpperCase() === currentAccount.toUpperCase())

    return final
  }

  const getAllUsers = async () => {
    const projectData = await contract.leaderboard
    return projectData
  }



  const loyaltyTokenContract = new ethers.Contract(
    lrtAddress,
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
        contract,
        loyaltyTokenContract,
        registerSeller,
        addProduct,
        purchaseProducts,
        exchangeLRTForMATIC,
        exchangeMATICForLRT,
        setLRTToken,
        withdrawTokens,
        withdrawMATIC,
        getAllProducts,
        getAllUsers,
        connectToMetaMask,
        isConnected,
        registerUser,
        getUserProducts,
        getUserOrders,
        currentAccount // Expose the current account to children components
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);