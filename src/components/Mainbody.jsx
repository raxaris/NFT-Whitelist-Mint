import React, {useState, useEffect} from 'react';
import '../styles/mainbody.css';
import AITU from '../AITU.json';
import { ethers, BigNumber } from "ethers";

function Mainbody() {
    const [connected, setConnected] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalMinted, setTotalMinted] = useState(0);
    const maxMinted = 500;
    const displayTokens = `${totalMinted}/${maxMinted}`;
    const displayStatus = totalMinted === maxMinted ? 'Sold out' : displayTokens;

    async function getTotalTokens(){
        const totalTokens = await contract.getTotalTokensMinted();
        return totalTokens.toNumber();
    }

    useEffect(() => {
        const intervalId = setInterval(async() => {
            const newTotalMinted = await contract.getTotalTokensMinted();
            setTotalMinted(newTotalMinted);
        }, 3000);
        return () => clearInterval(intervalId)
    },[])

    const contractAdress = '0xf53D69a470B88767503B90B6aD7fd92b29389C3d';
    let provider;
    if(typeof window.ethereum !== 'undefined'){
        provider = new ethers.providers.Web3Provider(window.ethereum);
    } else {
        provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/113c2db2a8e24cb480fd49ce53892560');
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAdress, AITU.abi, signer)

    async function connectWallet(){
        if (window.ethereum){
            try{
                await window.ethereum.request({ method: "eth_requestAccounts"});
                setConnected(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const address = await signer.getAddress();
            } catch (e) {
                console.log(e);
            }
        } else {
            alert('Install Metamask');
        }
    }

    const mintFunction = async () => {
        try{
            setLoading(true);
            const connection = contract.connect(signer);
            const addr = connection.address;
            const response = await contract.mint(BigNumber.from(quantity),{
                value: ethers.utils.parseEther(('0.005' * quantity).toString()),
            });
            console.log("response: ", response);

        } catch (error) {
            const errorMessage = error.message || '';
            if (errorMessage.includes("user rejected transaction")) {
                setError("You rejected transaction")
            } else {
                const match = errorMessage.match(/reason="execution reverted: ([^"]*)"/);
                if (match && match[1]) {
                    setError("Something get wrong...");
                }
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="row mx-auto p-5 text-center">
            <h2>AITU NFT Development</h2>
            <div className="mt-5 p-5">
                {connected?
                    <button type="button" onClick={mintFunction} className="btn btn-primary btn-lg">Mint</button>
                    :
                    <button type="button" onClick={connectWallet} className="btn btn-primary btn-lg p-5 rounded-5">Connect</button>
                }
            </div>
            <div className="mt-5 p-5">
                {connected?
                    <div className='connected'>
                        <h2>Minting Available!</h2>
                        <h3>{displayStatus}</h3>
                    </div>
                    : <h2>Connect MetaMask!</h2>
                }
            </div>
            <div>
                <h3 className='error'>{error}</h3>
                <div>{loading ? <h3>{loading}</h3> : ''}</div>
            </div>
        </div>
    );
}

export default Mainbody;