const hre = require("hardhat");
const {ethers} = require("ethers");

async function main() {

  const AITU = await hre.ethers.getContractFactory("AITU");
  const gasPrice = await AITU.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);

  const estimatedGas = await AITU.signer.estimateGas(
      AITU.getDeployTransaction(),
  );
  console.log(`Estimated gas: ${estimatedGas}`);

  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await AITU.signer.getBalance();
  console.log(`Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`);
  console.log(`Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`);
  if (deployerBalance.lt(deploymentPrice)) {
    throw new Error(
        `Insufficient funds. Top up your account balance by ${ethers.utils.formatEther(
            deploymentPrice.sub(deployerBalance),
        )}`,
    );
  }
  const aITU = await AITU.deploy();

  await aITU.deployed();

  console.log("AITU deployed to:", aITU.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });