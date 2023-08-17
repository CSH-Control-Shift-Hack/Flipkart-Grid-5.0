const hre = require('hardhat');

async function main() {

    const Loyalty = await hre.ethers.getContractFactory("Loyalty")
    const loyalty = await Loyalty.deploy();

    await loyalty.deployed();

    console.log("Factory deployed to:", loyalty.address);
}   

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });