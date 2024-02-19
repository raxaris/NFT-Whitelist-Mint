require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/113c2db2a8e24cb480fd49ce53892560',
      accounts: [process.env.METAMASK],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN,
  },
};