const { expect } = require("chai");
const { ethers } = require("hardhat");
const { Client, AccountId } = require("@hashgraph/sdk");

describe("MyNFT Contract", function () {
    let myNFT;
    let owner;
    let addr1;
    let addr2;
    let tokenServiceAddress;

    beforeEach(async function () {
        // Get test accounts
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy mock token service (for testing purposes)
        const MockHederaTokenService = await ethers.getContractFactory("MockHederaTokenService");
        const mockTokenService = await MockHederaTokenService.deploy();
        await mockTokenService.deployed();
        tokenServiceAddress = mockTokenService.address;

        // Deploy MyNFT contract
        const MyNFT = await ethers.getContractFactory("MyNFT");
        myNFT = await MyNFT.deploy(tokenServiceAddress);
        await myNFT.deployed();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await myNFT.owner()).to.equal(owner.address);
        });

        it("Should set the token service address", async function () {
            const tokenAddress = await myNFT.tokenService();
            expect(tokenAddress).to.equal(tokenServiceAddress);
        });
    });

    describe("NFT Operations", function () {
        it("Should create a new NFT collection", async function () {
            const tx = await myNFT.createToken(
                "Test NFT",
                "TNFT",
                "Test Collection",
                1000
            );

            await tx.wait();
            const tokenAddress = await myNFT.getTokenAddress();
            expect(tokenAddress).to.not.equal(ethers.constants.AddressZero);
        });

        it("Should mint NFTs", async function () {
            // First create token collection
            await myNFT.createToken("Test NFT", "TNFT", "Test Collection", 1000);

            // Prepare metadata
            const metadata = [
                ethers.utils.formatBytes32String("metadata1"),
                ethers.utils.formatBytes32String("metadata2")
            ];

            // Mint NFTs
            const tx = await myNFT.mintNFT(metadata);
            await tx.wait();

            // Add assertions here based on your implementation
            // You might want to check events, total supply, etc.
        });

        it("Should transfer NFT between accounts", async function () {
            // Create and mint NFT first
            await myNFT.createToken("Test NFT", "TNFT", "Test Collection", 1000);
            const metadata = [ethers.utils.formatBytes32String("metadata1")];
            await myNFT.mintNFT(metadata);

            // Transfer NFT
            const serialNumber = 1; // Assuming first minted NFT has serial number 1
            await myNFT.transferNFT(addr1.address, serialNumber);

            // Add assertions here to verify transfer
            // You might want to check ownership, events, etc.
        });

        it("Should fail when non-owner tries to create token", async function () {
            await expect(
                myNFT.connect(addr1).createToken(
                    "Test NFT",
                    "TNFT",
                    "Test Collection",
                    1000
                )
            ).to.be.revertedWith("Only owner can call this function");
        });
    });
});
