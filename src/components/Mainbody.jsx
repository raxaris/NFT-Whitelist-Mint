import React, {useState} from 'react';

function Mainbody() {
    const [connected,Setconnected] = useState(false)
    return (
        <div className="row mx-auto p-5 text-center">
            <h2>AITU NFT Development</h2>
            <div className="mt-5 p-5">
                {connected?
                    <button type="button" className="btn btn-primary btn-lg">Mint</button>
                    :
                    <button type="button" className="btn btn-primary btn-lg p-5 rounded-5">Connect</button>
                }
            </div>
            <div className="mt-5 p-5">
                {connected?
                    <h1>Minting Available!</h1>
                    :
                    <h1>Connect MetaMask!</h1>
                }
            </div>
        </div>
    );
}

export default Mainbody;