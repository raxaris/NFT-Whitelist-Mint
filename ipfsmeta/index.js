const fs = require('fs-extra');

const imageCID = 'https://ipfs.io/ipfs/QmT4iPfPf22FNRiNkAcXhAzU1tJwPuUDVZP29CEmzGDP3K';

const metadataFolder = "./metadata"

fs.ensureDirSync(metadataFolder);

for(let i = 1 ; i <= 6; i++){
    const metadata = {
        name : `AITUNFT #${i}`,
        description: 'AITU NFT',
        img: `${imageCID}/${i}.jpg`
    };

    const fileName = `${metadataFolder}/${i}.json`;

    fs.writeFileSync(fileName, JSON.stringify(metadata, null, 2));
}

console.log("Done. json files created")