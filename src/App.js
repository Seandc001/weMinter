import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Diamond from '@niftykit/diamond';
//clu81kbup0001bo5kv5jcmi8i
function App(props) {
    const [provider, setProvider] = useState(null);  // Add provider to state
    const [diamond, setDiamond] = useState(null);
    const [price, setPrice] = useState(null);
    const [quantity, setQuantity] = useState(1);
   

    useEffect(() => {
        async function init() {
            const collectionId = props.collectionId || 'clu81kbup0001bo5kv5jcmi8i';
           

            if (window.ethereum && collectionId) {
                try {
                    
                    const newProvider = new ethers.providers.Web3Provider(window.ethereum);
                    await newProvider.send('eth_requestAccounts', []);
                    const signer = newProvider.getSigner();
    
                    const sdkKey = collectionId; 
                    const newDiamond = await Diamond.create(signer, sdkKey);
                    if (newDiamond) {
                        console.log('Diamond SDK initialized successfully');
                        setProvider(newProvider);  
                        setDiamond(newDiamond);
                        const newPrice = await newDiamond.apps.drop.price();
                        console.log('Name' , newDiamond.base.name());
                        console.log('Supply' , newDiamond.base.totalSupply());
                        console.log('Display Price' , newDiamond.apps.drop.displayPrice());
                        console.log('Max' , newDiamond.apps.drop.maxPerWallet());
                        console.log('CoinsCount' , newDiamond.apps.erc20.erc20CoinsCount());

                        
                        setPrice(newPrice);
                        
                    } else {
                        console.error('Failed to initialize Diamond SDK');
                    }
                } catch (error) {
                    console.error('Error initializing app:', error);
                }
            } else {
                console.error('Ethereum object not found, make sure you have a web3 provider like MetaMask installed.');
            }
        }

        init();
    }, []);

    const mintNFT = async () => {
      if (!diamond || !provider) {
          console.error('Diamond SDK or provider is not initialized');
          return;
      }
      try {
          const signer = provider.getSigner();  // Get the signer from the provider
          const recipient = await signer.getAddress();  // Now this should work
          const tx = await diamond.apps.drop.mintTo(recipient, quantity, {
              value: price.mul(quantity),
          });
          await tx.wait();
          alert('NFT minted successfully!');
      } catch (error) {
          console.error('Error minting NFT:', error);
          alert(`Error minting NFT: ${error.data.message || error.data.message.toString()}`);
      }
    };

    return (
        <div>
            <h1>Mint NFT</h1>
            <p></p>
            <p>Price per NFT: {price ? `${price} ETH` : 'Loading...'}</p>
            <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                        {n}
                    </option>
                ))}
            </select>
            <button onClick={() => mintNFT('sd')}>Mint</button>
        </div>
    );
}

export default App; 
