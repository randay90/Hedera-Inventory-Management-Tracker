// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.5.0 <0.9.0;

import "./IHederaTokenService.sol";
import "./HederaResponseCodes.sol";

contract InventorySystem {
    struct InventoryItem {
        string name;
        string description;
        uint256 quantity;
        uint256 price;
        string location;
        uint256 lastUpdated;
        bool isActive;
    }

    // Storage variables
    mapping(uint256 => InventoryItem) public inventory;
    uint256 public itemCount;
    address public owner;
    mapping(address => bool) public authorizedUsers;

    // Events
    event ItemAdded(uint256 indexed itemId, string name, uint256 quantity);
    event ItemUpdated(uint256 indexed itemId, uint256 newQuantity, uint256 timestamp);
    event ItemRemoved(uint256 indexed itemId);
    event QuantityAdjusted(uint256 indexed itemId, int256 adjustment, string reason);
    event LowStockAlert(uint256 indexed itemId, uint256 currentQuantity);

    // Constants
    uint256 public constant LOW_STOCK_THRESHOLD = 10;

    constructor() {
        owner = msg.sender;
        authorizedUsers[msg.sender] = true;
        itemCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Not authorized");
        _;
    }

    function addItem(
        string memory name,
        string memory description,
        uint256 quantity,
        uint256 price,
        string memory location
    ) public onlyAuthorized {
        itemCount++;
        inventory[itemCount] = InventoryItem({
            name: name,
            description: description,
            quantity: quantity,
            price: price,
            location: location,
            lastUpdated: block.timestamp,
            isActive: true
        });

        emit ItemAdded(itemCount, name, quantity);
        
        if (quantity <= LOW_STOCK_THRESHOLD) {
            emit LowStockAlert(itemCount, quantity);
        }
    }

    function updateQuantity(
        uint256 itemId,
        int256 adjustment,
        string memory reason
    ) public onlyAuthorized {
        require(inventory[itemId].isActive, "Item does not exist");
        
        if (adjustment < 0) {
            require(inventory[itemId].quantity >= uint256(-adjustment), "Insufficient quantity");
            inventory[itemId].quantity -= uint256(-adjustment);
        } else {
            inventory[itemId].quantity += uint256(adjustment);
        }
        
        inventory[itemId].lastUpdated = block.timestamp;
        
        emit QuantityAdjusted(itemId, adjustment, reason);
        emit ItemUpdated(itemId, inventory[itemId].quantity, block.timestamp);

        if (inventory[itemId].quantity <= LOW_STOCK_THRESHOLD) {
            emit LowStockAlert(itemId, inventory[itemId].quantity);
        }
    }

    function getItem(uint256 itemId) public view returns (
        string memory name,
        string memory description,
        uint256 quantity,
        uint256 price,
        string memory location,
        uint256 lastUpdated,
        bool isActive
    ) {
        InventoryItem storage item = inventory[itemId];
        require(item.isActive, "Item does not exist");
        
        return (
            item.name,
            item.description,
            item.quantity,
            item.price,
            item.location,
            item.lastUpdated,
            item.isActive
        );
    }

    function deactivateItem(uint256 itemId) public onlyAuthorized {
        require(inventory[itemId].isActive, "Item does not exist");
        inventory[itemId].isActive = false;
        emit ItemRemoved(itemId);
    }

    function addAuthorizedUser(address user) public onlyOwner {
        authorizedUsers[user] = true;
    }

    function removeAuthorizedUser(address user) public onlyOwner {
        require(user != owner, "Cannot remove owner");
        authorizedUsers[user] = false;
    }

    function getItemCount() public view returns (uint256) {
        return itemCount;
    }
}
