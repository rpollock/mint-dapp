// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    uint256 public constant PRICE_PER_TOKEN = 0.0001 ether;

    constructor() ERC20("Cool Pixel Token", "CPT") Ownable(msg.sender) {}

    function mint(address to) public payable {
        require(msg.value >= PRICE_PER_TOKEN, "Insufficient ETH");
        uint256 tokens = (msg.value / PRICE_PER_TOKEN) * 10 ** decimals();
        _mint(to, tokens);
        
        // Refund excess ETH
        uint256 refund = msg.value - (tokens / 10 ** decimals() * PRICE_PER_TOKEN);
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }
    }

    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}