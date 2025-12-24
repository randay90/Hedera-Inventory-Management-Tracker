// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "./IHederaTokenService.sol";
import "./HederaResponseCodes.sol";

contract MockHederaTokenService is IHederaTokenService {
    mapping(address => bool) public tokens;
    mapping(address => mapping(int64 => address)) public nftOwners;
    uint64 private _totalSupply;
    int64 private _currentSerialNumber;

    function createNonFungibleToken(HederaToken memory token) 
        external 
        payable 
        override 
        returns (int responseCode, address tokenAddress) 
    {
        tokenAddress = address(bytes20(keccak256(abi.encodePacked(token.name, token.symbol, block.timestamp))));
        tokens[tokenAddress] = true;
        return (HederaResponseCodes.SUCCESS, tokenAddress);
    }

    function mintToken(address token, uint64 amount, bytes[] memory metadata) 
        external 
        override 
        returns (int responseCode, uint64 newTotalSupply, int64[] memory serialNumbers) 
    {
        require(tokens[token], "Token does not exist");
        
        serialNumbers = new int64[](amount);
        for(uint64 i = 0; i < amount; i++) {
            _currentSerialNumber++;
            serialNumbers[i] = _currentSerialNumber;
            nftOwners[token][_currentSerialNumber] = msg.sender;
        }
        
        _totalSupply += amount;
        newTotalSupply = _totalSupply;
        
        return (HederaResponseCodes.SUCCESS, newTotalSupply, serialNumbers);
    }

    function transferNFT(address token, address sender, address receiver, int64 serialNumber) 
        external 
        override 
        returns (int responseCode) 
    {
        require(tokens[token], "Token does not exist");
        require(nftOwners[token][serialNumber] == sender, "Sender does not own this NFT");
        
        nftOwners[token][serialNumber] = receiver;
        return HederaResponseCodes.SUCCESS;
    }
}
