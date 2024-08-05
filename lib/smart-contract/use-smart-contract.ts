import { create } from "zustand";
import { ethers } from "ethers";
import contractABI from "@/lib/smart-contract/ABI.json";
import USDT_ABI from "@/lib/smart-contract/USDT_ABI.json";

const contractAddress = "0x622f5b32ad5D6D2147Ff6c4261e5cE11A2949A9f";

const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // Ethereum Mainnet USDT address

interface BlockchainState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  contract: ethers.Contract | null;
  balance: string;
  isConnecting: boolean;
  isWalletConnected: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  deposit: (amount: string) => Promise<void>;
  withdraw: (amount: string, toAddress?: string) => Promise<void>;
}

const useSmartContractStore = create<BlockchainState>((set, get) => ({
  provider: null,
  signer: null,
  account: null,
  contract: null,
  balance: "0",
  isConnecting: false,
  isWalletConnected: false,
  error: null,

  connectWallet: async () => {
    set({ isConnecting: true, error: null });
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI.abi,
          signer,
        );
        // const balance = await contractInstance.balanceOf(address);
        set({
          provider,
          signer,
          account: address,
          contract: contractInstance,
          // balance: ethers.formatEther(balance),
          isConnecting: false,
          isWalletConnected: true,
        });
      } else {
        throw new Error("Please install MetaMask!");
      }
    } catch (error) {
      set({ error: (error as Error).message, isConnecting: false });
    }
  },

  disconnect: () => {
    set({
      provider: null,
      signer: null,
      account: null,
      contract: null,
      balance: "0",
      isWalletConnected: false,
    });
  },

  deposit: async (amount: string) => {
    const { contract, account } = get();
    if (contract && amount) {
      try {
        const tx = await contract.deposit({ value: ethers.parseEther(amount) });
        await tx.wait();
        const newBalance = await contract.balanceOf(account);
        set({ balance: ethers.formatEther(newBalance) });
      } catch (error) {
        set({ error: (error as Error).message });
      }
    }
  },

  withdraw: async (amount: string, toAddress?: string) => {
    const { contract, account } = get();
    if (contract && amount) {
      try {
        let tx;
        if (toAddress) {
          tx = await contract.withdrawTo(toAddress, ethers.parseEther(amount));
        } else {
          tx = await contract.withdraw(ethers.parseEther(amount));
        }
        await tx.wait();
        const newBalance = await contract.balanceOf(account);
        set({ balance: ethers.formatEther(newBalance) });
      } catch (error) {
        set({ error: (error as Error).message });
      }
    }
  },
}));

export default useSmartContractStore;
