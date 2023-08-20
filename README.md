# CSH: Ctrl + Shift+ Hack's E-Commerce Loyalty Platform

Welcome to the official repository of CSH: Ctrl + Shift+ Hack's E-Commerce Loyalty Platform. Our platform seamlessly integrates ERC20 FLIP tokens with an E-Commerce loyalty smart contract, offering an innovative solution in the decentralized space.

## 📁 Repository Structure

- **frontend/**: Contains all the frontend code of the platform.
- **backend/**: Contains the smart contracts and backend-related code.

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Hardhat](https://hardhat.org/)
- [MetaMask](https://metamask.io/) or any web3 provider

## 🚀 Setup & Installation

### Backend (Smart Contracts)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Compile the smart contracts:
   ```bash
   npx hardhat compile
   ```

4. Deploy the smart contracts (make sure you have a local Ethereum blockchain running, e.g., Hardhat Network):
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

The platform should now be running on `http://localhost:3000`.

## ✨ Features

- Seamless integration with the Polygon Mumbai testnet.
- Intuitive user experience for both buyers and sellers.
- Transparent transaction processes with detailed insights.

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for more details.

## 🌐 Connect with Us

- [Visit our Platform](#)
- [Read our Documentation](https://docs.google.com/document/d/1Zfp55chiDN3hmskF9sUsL7w-Yl7H85FTG993z51lgzA/edit?usp=sharing)
