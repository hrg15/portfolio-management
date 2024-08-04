import { create } from "zustand";
import { ethers } from "ethers";
import contractABI from "@/lib/smart-contract/ABI.json";

const contractAddress = "YOUR_CONTRACT_ADDRESS";

interface BlockchainState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  contract: ethers.Contract | null;
  balance: string;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
  deposit: (amount: string) => Promise<void>;
  withdraw: (amount: string, toAddress?: string) => Promise<void>;
  getAllowedWithdrawAddresses: () => Promise<string[]>;
}

const useSmartContractStore = create<BlockchainState>((set, get) => ({
  provider: null,
  signer: null,
  account: null,
  contract: null,
  balance: "0",
  isConnecting: false,
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
        const balance = await contractInstance.balanceOf(address);
        set({
          provider,
          signer,
          account: address,
          contract: contractInstance,
          balance: ethers.formatEther(balance),
          isConnecting: false,
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

  getAllowedWithdrawAddresses: async () => {
    const { contract, account } = get();
    if (contract && account) {
      try {
        const addresses = await contract.getAllowedWithdrawAddresses(account);
        return addresses;
      } catch (error) {
        set({ error: (error as Error).message });
        return [];
      }
    }
    return [];
  },
}));

export default useSmartContractStore;
