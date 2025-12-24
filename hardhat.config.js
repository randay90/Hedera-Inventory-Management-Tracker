require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      // For testing
    },
    testnet: {
      url: `https://testnet.hashio.io/api`,
      accounts: process.env.OPERATOR_KEY ? [process.env.OPERATOR_KEY] : [],
    }
  },
};
