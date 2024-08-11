import React from "react";

const HandleErrors = () => {
  return <div>handleErrors</div>;
};

export default HandleErrors;

// const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

// // The contract address you want to send Ether to
// const contractAddress = "0xYourContractAddress";

// // Define the amount of Ether to send (e.g., 0.1 Ether)
// const amountInEther = "0.1";

// // Create a transaction object
// const tx = {
//     to: contractAddress,
//     value: ethers.utils.parseEther(amountInEther) // Convert Ether amount to Wei
// };

// // Send the transaction
// async function sendEther() {
//     try {
//         const transaction = await wallet.sendTransaction(tx);
//         console.log("Transaction Hash:", transaction.hash);

//         // Wait for the transaction to be mined
//         const receipt = await transaction.wait();
//         console.log("Transaction was mined in block:", receipt.blockNumber);
//     } catch (error) {
//         console.error("Error sending Ether:", error);
//     }
// }
