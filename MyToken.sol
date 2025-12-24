// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint256 private constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens with 18 decimals

    constructor() ERC20("MyToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // Allow the owner to mint new tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Allow the owner to burn tokens from any address
    function burn(address from, uint256 amount) public onlyOwner {
        _burn(from, amount);
    }

    // Allow users to burn their own tokens
    function burnOwn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    // View function to see decimals
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
