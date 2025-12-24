const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InventorySystem Contract", function () {
    let InventorySystem;
    let inventory;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get test accounts
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy InventorySystem contract
        InventorySystem = await ethers.getContractFactory("InventorySystem");
        inventory = await InventorySystem.deploy();
        await inventory.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await inventory.owner()).to.equal(owner.address);
        });

        it("Should mark owner as authorized", async function () {
            expect(await inventory.authorizedUsers(owner.address)).to.equal(true);
        });
    });

    describe("Inventory Operations", function () {
        it("Should add a new item correctly", async function () {
            await inventory.addItem(
                "Test Item",
                "Test Description",
                100,
                1000,
                "Warehouse A"
            );

            const item = await inventory.getItem(1);
            expect(item.name).to.equal("Test Item");
            expect(item.quantity).to.equal(100);
            expect(item.price).to.equal(1000);
            expect(item.location).to.equal("Warehouse A");
        });

        it("Should update quantity correctly", async function () {
            await inventory.addItem(
                "Test Item",
                "Test Description",
                100,
                1000,
                "Warehouse A"
            );

            await inventory.updateQuantity(1, -50, "Sale");
            const item = await inventory.getItem(1);
            expect(item.quantity).to.equal(50);
        });

        it("Should emit LowStockAlert when quantity is below threshold", async function () {
            await inventory.addItem(
                "Test Item",
                "Test Description",
                15,
                1000,
                "Warehouse A"
            );

            await expect(inventory.updateQuantity(1, -10, "Sale"))
                .to.emit(inventory, "LowStockAlert")
                .withArgs(1, 5);
        });

        it("Should prevent unauthorized users from adding items", async function () {
            await expect(
                inventory.connect(addr1).addItem(
                    "Test Item",
                    "Test Description",
                    100,
                    1000,
                    "Warehouse A"
                )
            ).to.be.revertedWith("Not authorized");
        });
    });

    describe("Access Control", function () {
        it("Should allow owner to add authorized users", async function () {
            await inventory.addAuthorizedUser(addr1.address);
            expect(await inventory.authorizedUsers(addr1.address)).to.equal(true);
        });

        it("Should allow authorized users to add items", async function () {
            await inventory.addAuthorizedUser(addr1.address);
            await inventory.connect(addr1).addItem(
                "Test Item",
                "Test Description",
                100,
                1000,
                "Warehouse A"
            );
            
            const item = await inventory.getItem(1);
            expect(item.name).to.equal("Test Item");
        });
    });

    describe("Real World Inventory Management", function () {
        beforeEach(async function () {
            // Add warehouse manager as authorized user
            await inventory.addAuthorizedUser(addr1.address);
        });

        it("Should display inventory with simple format", async function () {
            // Add items to Downtown Store
            await inventory.addItem(
                "MacBook Pro M3",
                "16-inch, Space Black, 32GB RAM",
                25,
                2499_99,
                "Downtown Store - Electronics"
            );

            await inventory.addItem(
                "AirPods Pro",
                "2nd Generation with USB-C",
                50,
                249_99,
                "Downtown Store - Accessories"
            );

            // Add items to Mall Location
            await inventory.addItem(
                "iPad Air",
                "5th Generation, 256GB, WiFi",
                30,
                749_99,
                "Mall Location - Tablets"
            );

            await inventory.addItem(
                "Apple Watch Series 9",
                "45mm, Cellular, Titanium",
                20,
                799_99,
                "Mall Location - Wearables"
            );

            // Add items to Airport Store
            await inventory.addItem(
                "Bose QuietComfort",
                "Wireless Noise Cancelling Headphones",
                40,
                379_99,
                "Airport Store - Audio"
            );

            // Simulate Weekend Sales across locations
            console.log(`
╔════════════════════════════════════════════════════════════════╗
║                 INVENTORY MANAGEMENT SYSTEM                     ║
╚════════════════════════════════════════════════════════════════╝`);
            console.log(`
┌────────────────────────────────────────┐
│         � INVENTORY DASHBOARD         │
└────────────────────────────────────────┘`);
            
            let totalValue = 0;
            // We know we have exactly 5 items
            for (let i = 1; i <= 5; i++) {
                const item = await inventory.getItem(i);
                const itemValue = Number(item.price) * Number(item.quantity) / 100;
                totalValue += Number(itemValue);
                console.log(`
╭───────────────── ITEM ${i} ─────────────────╮
│ 🏪 Store: ${item.location}
│ 📝 Product: ${item.name}
│ ℹ️  Description: ${item.description}
│ 🔢 Quantity: ${item.quantity} units
│ 💰 Price: $${Number(item.price)/100}
│ 💵 Total Value: $${itemValue.toFixed(2)}
╰─────────────────────────────────────────╯`);
            }
            console.log(`
┌────────────────────────────────────────┐
│ 💰 Total Inventory Value: $${totalValue.toFixed(2)}
└────────────────────────────────────────┘`);

            // Downtown Store Sales
            await inventory.updateQuantity(1, -3, "Weekend Sale - Downtown");
            await inventory.updateQuantity(2, -8, "Weekend Sale - Downtown");

            // Mall Location Sales
            await inventory.updateQuantity(3, -5, "Weekend Sale - Mall");
            await inventory.updateQuantity(4, -4, "Weekend Sale - Mall");

            // Airport Store Sales
            await inventory.updateQuantity(5, -10, "Weekend Sale - Airport");

            console.log(`
┌────────────────────────────────────────┐
│      🛍️  After Weekend Sales           │
└────────────────────────────────────────┘`);
            totalValue = 0;
            for (let i = 1; i <= 5; i++) {
                const item = await inventory.getItem(i);
                const itemValue = Number(item.price) * Number(item.quantity) / 100;
                totalValue += Number(itemValue);
                console.log(`
╭───────────────── ITEM ${i} ─────────────────╮
│ 🏪 Store: ${item.location}
│ 📝 Product: ${item.name}
│ ℹ️  Description: ${item.description}
│ 🔢 Quantity: ${item.quantity} units
│ 💰 Price: $${Number(item.price)/100}
│ 💵 Total Value: $${itemValue.toFixed(2)}
╰─────────────────────────────────────────╯`);
            }
            console.log(`
┌────────────────────────────────────────┐
│ 💰 Total Inventory Value: $${totalValue.toFixed(2)}
└────────────────────────────────────────┘`);

            // Restock Orders
            await inventory.updateQuantity(1, 5, "Weekly Restock - Downtown");  // MacBook Pro
            await inventory.updateQuantity(2, 15, "Weekly Restock - Downtown"); // AirPods
            await inventory.updateQuantity(5, 20, "Weekly Restock - Airport");  // Bose Headphones

            console.log(`
┌────────────────────────────────────────┐
│      📥 After Restock Updates          │
└────────────────────────────────────────┘`);
            totalValue = 0;
            for (let i = 1; i <= 5; i++) {
                const item = await inventory.getItem(i);
                const itemValue = Number(item.price) * Number(item.quantity) / 100;
                totalValue += Number(itemValue);
                console.log(`
╭───────────────── ITEM ${i} ─────────────────╮
│ 🏪 Store: ${item.location}
│ 📝 Product: ${item.name}
│ ℹ️  Description: ${item.description}
│ 🔢 Quantity: ${item.quantity} units
│ 💰 Price: $${Number(item.price)/100}
│ 💵 Total Value: $${itemValue.toFixed(2)}
╰─────────────────────────────────────────╯`);
            }
            console.log(`
┌────────────────────────────────────────┐
│ 💰 Total Inventory Value: $${totalValue.toFixed(2)}
└────────────────────────────────────────┘`);

            // Verify final quantities
            const macbook = await inventory.getItem(1);
            const airpods = await inventory.getItem(2);
            const ipad = await inventory.getItem(3);
            const watch = await inventory.getItem(4);
            const bose = await inventory.getItem(5);

            expect(macbook.quantity).to.equal(27); // 25 - 3 + 5
            expect(macbook.location).to.equal("Downtown Store - Electronics");
            expect(macbook.price).to.equal(249999);

            expect(airpods.quantity).to.equal(57); // 50 - 8 + 15
            expect(airpods.location).to.equal("Downtown Store - Accessories");

            expect(ipad.quantity).to.equal(25); // 30 - 5
            expect(ipad.location).to.equal("Mall Location - Tablets");

            expect(watch.quantity).to.equal(16); // 20 - 4
            expect(watch.location).to.equal("Mall Location - Wearables");

            expect(bose.quantity).to.equal(50); // 40 - 10 + 20
            expect(bose.location).to.equal("Airport Store - Audio");
        });

        it("Should manage a retail electronics inventory", async function () {
            // Add some electronic items
            await inventory.addItem(
                "iPhone 15 Pro",
                "256GB, Space Black",
                50,
                999_99,
                "Electronics Section A"
            );

            await inventory.addItem(
                "Samsung 65\" QLED TV",
                "4K Smart TV, 2025 Model",
                15,
                1299_99,
                "Electronics Section B"
            );

            await inventory.addItem(
                "Sony WH-1000XM5",
                "Wireless Noise Cancelling Headphones",
                30,
                399_99,
                "Electronics Section A"
            );

            // Simulate some sales
            await inventory.updateQuantity(1, -2, "Daily Sales");
            await inventory.updateQuantity(2, -1, "Daily Sales");
            await inventory.updateQuantity(3, -5, "Daily Sales");

            // Check inventory levels
            const iphone = await inventory.getItem(1);
            const tv = await inventory.getItem(2);
            const headphones = await inventory.getItem(3);

            expect(iphone.quantity).to.equal(48);
            expect(tv.quantity).to.equal(14);
            expect(headphones.quantity).to.equal(25);

            // Simulate restocking
            await inventory.updateQuantity(1, 10, "Weekly Restock");
            const restockedIphone = await inventory.getItem(1);
            expect(restockedIphone.quantity).to.equal(58);
        });
    });
});
