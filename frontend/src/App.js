import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
const contractAbi = [ /* ABI from compiled contract */ ];

function App() {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        setError('Failed to connect wallet');
      }
    } else {
      setError('Please install MetaMask');
    }
  };

  const mintTokens = async () => {
    if (!account) return setError('Connect wallet first');
    if (!amount || isNaN(amount)) return setError('Invalid amount');

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);
      
      const value = ethers.BigNumber.from(amount).mul(ethers.BigNumber.from('100000000000000'));
      const tx = await contract.mint(account, { value });
      await tx.wait();
      
      setSuccess(`${amount} MTK minted successfully!`);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Mint MTK Tokens</h1>
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
              {loading ? 'Minting...' : 'Mint Tokens'}
            </button>
          </div>
          <p className="cost">Cost: {amount ? amount * 0.0001 : 0} ETH</p>
          {error && <p className="error">Error: {error}</p>}
          {success && <p className="success">{success}</p>}
        </div>
      )}
    </div>
  );
}

export default App;