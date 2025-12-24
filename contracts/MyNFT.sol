// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "./IHederaTokenService.sol";
import "./HederaResponseCodes.sol";

contract MyNFT {
    address private owner;
    address private tokenAddress;
    IHederaTokenService private tokenService;

    event NFTCreated(address tokenAddress);
    event NFTMinted(uint64 newTotalSupply, int64[] serialNumbers);
    event NFTTransferred(address from, address to, int64 serialNumber);

    constructor(address _tokenService) {
        owner = msg.sender;
        tokenService = IHederaTokenService(_tokenService);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createToken(
        string memory name,
        string memory symbol,
        string memory memo,
        int64 maxSupply
    ) external onlyOwner {
        IHederaTokenService.HederaToken memory token;
        token.name = name;
        token.symbol = symbol;
        token.memo = memo;
        token.treasury = address(this);
        token.tokenSupplyType = false; // FINITE
        token.maxSupply = maxSupply;
        token.freezeDefault = false;

        (int responseCode, address _tokenAddress) = tokenService.createNonFungibleToken(token);
        
        require(responseCode == HederaResponseCodes.SUCCESS, "Failed to create token");
        tokenAddress = _tokenAddress;
        
        emit NFTCreated(_tokenAddress);
    }

    function mintNFT(bytes[] memory metadata) external onlyOwner {
        require(tokenAddress != address(0), "Token not created yet");
        
        (int responseCode, uint64 newTotalSupply, int64[] memory serialNumbers) = 
            tokenService.mintToken(tokenAddress, uint64(metadata.length), metadata);
            
        require(responseCode == HederaResponseCodes.SUCCESS, "Failed to mint NFT");
        
        emit NFTMinted(newTotalSupply, serialNumbers);
    }

    function transferNFT(address to, int64 serialNumber) external {
        require(tokenAddress != address(0), "Token not created yet");
        
        int responseCode = tokenService.transferNFT(tokenAddress, msg.sender, to, serialNumber);
        require(responseCode == HederaResponseCodes.SUCCESS, "Failed to transfer NFT");
        
        emit NFTTransferred(msg.sender, to, serialNumber);
    }

    function getTokenAddress() external view returns (address) {
        return tokenAddress;
    }
}
