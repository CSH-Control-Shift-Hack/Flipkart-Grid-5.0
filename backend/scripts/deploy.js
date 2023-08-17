async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    // console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const CrowdFunding = await ethers.getContractFactory("ECommerceLoyalty");
    const funding = await CrowdFunding.deploy('0x863441952A806c680cea03915077B72876DA17f3');
  
    console.log("Contract address:", funding);
  }
  
// npx hardhat run scripts/deploy.js --network polygon

  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  
