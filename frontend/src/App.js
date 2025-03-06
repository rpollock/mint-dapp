import React, { useState, useEffect, useRef } from 'react';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import MetaMaskOnboarding from '@metamask/onboarding';

import logo from './img/cpt1.png';
import './App.css';

const contractAddress = '0x9033222c5F730BCA749A3d3f5C264c5F05E30550';
const contractAbi = [ {
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "allowance",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "needed",
      "type": "uint256"
    }
  ],
  "name": "ERC20InsufficientAllowance",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "sender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "balance",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "needed",
      "type": "uint256"
    }
  ],
  "name": "ERC20InsufficientBalance",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "approver",
      "type": "address"
    }
  ],
  "name": "ERC20InvalidApprover",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "receiver",
      "type": "address"
    }
  ],
  "name": "ERC20InvalidReceiver",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "sender",
      "type": "address"
    }
  ],
  "name": "ERC20InvalidSender",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    }
  ],
  "name": "ERC20InvalidSpender",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }
  ],
  "name": "OwnableInvalidOwner",
  "type": "error"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "OwnableUnauthorizedAccount",
  "type": "error"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "Approval",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "previousOwner",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "OwnershipTransferred",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "Transfer",
  "type": "event"
},
{
  "inputs": [],
  "name": "PRICE_PER_TOKEN",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "owner",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    }
  ],
  "name": "allowance",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "spender",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "approve",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "account",
      "type": "address"
    }
  ],
  "name": "balanceOf",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "decimals",
  "outputs": [
    {
      "internalType": "uint8",
      "name": "",
      "type": "uint8"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    }
  ],
  "name": "mint",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
},
{
  "inputs": [],
  "name": "name",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "owner",
  "outputs": [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "symbol",
  "outputs": [
    {
      "internalType": "string",
      "name": "",
      "type": "string"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "totalSupply",
  "outputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "transfer",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "from",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }
  ],
  "name": "transferFrom",
  "outputs": [
    {
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }
  ],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [
    {
      "internalType": "address",
      "name": "newOwner",
      "type": "address"
    }
  ],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "withdraw",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
} ];

function App() {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const onboarding = useRef();

  useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  const connectWallet = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setError('');
      } catch (err) {
        setError('Failed to connect wallet');
      }
    } else {
      setError('MetaMask is not installed');
      onboarding.current.startOnboarding();
    }
  };

  const mintTokens = async () => {
    if (!account) return setError('Connect wallet first');
    if (!amount || isNaN(amount)) return setError('Invalid amount');

    try {
      setLoading(true);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, contractAbi, signer);

      const value = parseUnits(amount, 14);
      const tx = await contract.mint(account, { value });

      await tx.wait();

      setSuccess(`${amount} CPT minted successfully!`);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* nav bar */}
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Cool Pixel Turtle" />
        </div>
        <div className="social-links">
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            Discord
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        </div>
      </nav>
{/* hero seciton */}
      <header className="hero">
        <h1>Cool Pixel Tokens</h1>
        <p>Mint your own pixel tokens now!</p>
        {!account ? (
          <button className="connect-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <a href="#mint" className="mint-btn">
            Go to Minting
          </a>
        )}
      </header>
{/* about sectino */}
      <section className="about">
        <div className="about-container">
          <div className="about-text">
            <h2>About Cool Pixel Turtle</h2>
            <p>
              Cool Pixel Turtle is a fun ERC-20 token project designed for pixel art lovers.
              Join the community and collect awesome pixel turtles!
            </p>
          </div>

          <div className="about-image">
            <img src="pixil-frame.png" alt="Cool Pixel Turtle" />
          </div>
        </div>
      </section>
          {/* road map */}
      <section className="roadmap">
        <h2>Roadmap</h2>
        <ul>
          <li>🚀 Phase 1: Launch website & smart contract</li>
          <li>🎨 Phase 2: Introduce rare pixel turtle designs</li>
          <li>💎 Phase 3: Community rewards & airdrops</li>
          <li>🌍 Phase 4: Expand ecosystem & partnerships</li>
        </ul>
      </section>
          {/* Minting section */}
      <section className="minting" id="mint">
        <h2>Mint Your Cool Pixel Tokens</h2>
        {!account ? (
          <button className="connect-btn" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <div className="mint-section">
            <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
            <div className="input-group">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter token amount"
                min="1"
              />
              <button onClick={mintTokens} disabled={loading}>
                {loading ? "Minting..." : "Mint Tokens"}
              </button>
            </div>
            <p className="cost">Cost: {amount ? amount * 0.0001 : 0} ETH</p>
            {error && <p className="error">Error: {error}</p>}
            {success && <p className="success">{success}</p>}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Cool Pixel Turtle. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
