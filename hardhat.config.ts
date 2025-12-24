import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

// Convert Hedera's ED25519 private key to secp256k1 private key
function getEthereumPrivateKey(hederaPrivateKey: string): string {
  // Remove the leading '302e020100300506032b6570042204' if present
  const cleanKey = hederaPrivateKey.replace('302e020100300506032b6570042204', '');
  // Return the first 32 bytes (64 characters) of the cleaned key
  return cleanKey.substring(0, 64);
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.22",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  networks: {
    hedera: {
      url: "https://testnet.hashio.io/api",
      accounts: [process.env.OPERATOR_KEY ? getEthereumPrivateKey(process.env.OPERATOR_KEY) : ''],
      chainId: 296
    }
  }
};

export default config;
