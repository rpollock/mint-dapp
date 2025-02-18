const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
    let Token, token, owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.waitForDeployment();
    });

    it("Should deploy with correct name and symbol", async function () {
        expect(await token.name()).to.equal("MyToken");
        expect(await token.symbol()).to.equal("MTK");
    });

    it("Should allow users to mint tokens", async function () {
        const pricePerToken = await token.PRICE_PER_TOKEN();

        // Mint tokens
        await token.connect(addr1).mint(addr1.address, { value: pricePerToken });

        const balance = await token.balanceOf(addr1.address);
        expect(balance).to.be.greaterThan(0);
    });

    it("Should revert if insufficient ETH is sent", async function () {
        await expect(
            token.connect(addr1).mint(addr1.address, { value: ethers.parseEther("0.00001") })
        ).to.be.revertedWith("Insufficient ETH");
    });

    it("Should refund excess ETH", async function () {
      const pricePerToken = await token.PRICE_PER_TOKEN();
      const overpay = pricePerToken * BigInt(2); // Send twice the required amount
  
      console.log("Price per token:", pricePerToken.toString());
      console.log("Overpayment sent:", overpay.toString());
      const balanceBefore = await ethers.provider.getBalance(addr1.address);
      console.log("Balance before minting:", balanceBefore.toString());

      const tx = await token.connect(addr1).mint(addr1.address, { value: overpay });
      const receipt = await tx.wait();
  
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      console.log("Gas used:", gasUsed.toString());

      const balanceAfter = await ethers.provider.getBalance(addr1.address);
      console.log("Balance after minting:", balanceAfter.toString());

      const expectedRefund = overpay - pricePerToken; // Refund excess ETH
      console.log("Expected refund:", expectedRefund.toString());

      const actualRefund = balanceBefore - balanceAfter;
      console.log("Actual refund:", actualRefund.toString());
  
      expect(actualRefund).to.be.closeTo(expectedRefund, gasUsed);
  });
  
  
  

    it("Should allow owner to withdraw funds", async function () {
        const pricePerToken = await token.PRICE_PER_TOKEN();
        await token.connect(addr1).mint(addr1.address, { value: pricePerToken });
        const balanceBefore = await ethers.provider.getBalance(owner.address);
        const tx = await token.withdraw();
        await tx.wait();
        const balanceAfter = await ethers.provider.getBalance(owner.address);
        expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
});
