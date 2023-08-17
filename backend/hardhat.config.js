require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat", 
  networks: {
    hardhat: {},
    localhost:{
      url: "http://localhost:7545",
      chainId: 31337,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    polygon: {
      url: 'https://rpc-mumbai.maticvigil.com/',
      accounts: [PRIVATE_KEY2],
      chainId: 80001,
    },
  },
};
