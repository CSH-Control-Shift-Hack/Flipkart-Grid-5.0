require("@nomiclabs/hardhat-waffle");
require('dotenv').config({ path: './.env.local' });

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
})

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY

const PRIVATE_KEY2 = process.env.PRIVATE_KEY2;

module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "polygon",
  networks: {
    hardhat: {},
    polygon: {
      url: 'https://matic-mumbai.chainstacklabs.com/',
      accounts: [PRIVATE_KEY2],
      chainId: 80001,
    },
  }
};