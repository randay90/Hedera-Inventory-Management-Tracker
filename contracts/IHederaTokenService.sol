// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

interface IHederaTokenService {
    struct TokenKey {
        uint8 keyType;
        bytes key;
    }

    struct Expiry {
        uint32 second;
        uint32 autoRenewPeriod;
        address autoRenewAccount;
    }

    struct HederaToken {
        string name;
        string symbol;
        address treasury;
        string memo;
        bool tokenSupplyType;
        int64 maxSupply;
        bool freezeDefault;
        TokenKey[] tokenKeys;
        Expiry expiry;
    }

    function createNonFungibleToken(HederaToken memory token) external payable returns (int responseCode, address tokenAddress);
    function mintToken(address token, uint64 amount, bytes[] memory metadata) external returns (int responseCode, uint64 newTotalSupply, int64[] memory serialNumbers);
    function transferNFT(address token, address sender, address receiver, int64 serialNumber) external returns (int responseCode);
}
