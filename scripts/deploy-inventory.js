const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy InventorySystem
    const InventorySystem = await ethers.getContractFactory("InventorySystem");
    const inventory = await InventorySystem.deploy();
    await inventory.deployed();

    console.log("InventorySystem deployed to:", inventory.address);

    // Add a test item
    console.log("\nAdding test item...");
    try {
        const tx = await inventory.addItem(
            "Test Product",
            "This is a test product",
            100,
            ethers.utils.parseEther("0.1"),  // 0.1 HBAR price
            "Main Warehouse"
        );
        await tx.wait();
        console.log("Test item added successfully!");

        // Get and display the item
        const item = await inventory.getItem(1);
        console.log("\nItem details:");
        console.log("Name:", item.name);
        console.log("Description:", item.description);
        console.log("Quantity:", item.quantity.toString());
        console.log("Price:", ethers.utils.formatEther(item.price), "HBAR");
        console.log("Location:", item.location);
        console.log("Last Updated:", new Date(item.lastUpdated * 1000).toLocaleString());
    } catch (error) {
        console.error("Error adding test item:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
