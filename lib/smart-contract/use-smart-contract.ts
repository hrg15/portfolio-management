import { create } from "zustand";
import { ethers } from "ethers";
import contractABI from "@/lib/smart-contract/ABI.json";
import contractERC20ABI from "@/lib/smart-contract/ERC20_ABI.json";
import USDT_ABI from "@/lib/smart-contract/USDT_ABI.json";
import { toast } from "sonner";
import { CONTRACT_ADDRESS } from "@/config";

// const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // Ethereum Mainnet USDT address

interface BlockchainState {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  contract: ethers.Contract | null;
  contractERC20: ethers.Contract | null;
  balance: string;
  isConnecting: boolean;
  isWalletConnected: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnect: () => void;
}

const useSmartContractStore = create<BlockchainState>((set, get) => ({
  provider: null,
  signer: null,
  account: null,
  contract: null,
  contractERC20: null,
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

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        // Polygon Mainnet chainId is 0x89, Mumbai Testnet is 0x13881
        const polygonChainId = "0x89";

        if (chainId !== polygonChainId) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: polygonChainId }],
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError?.code === 4902) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: polygonChainId,
                    chainName: "Polygon Mainnet",
                    nativeCurrency: {
                      name: "MATIC",
                      symbol: "MATIC",
                      decimals: 18,
                    },
                    rpcUrls: ["https://polygon-rpc.com/"],
                    blockExplorerUrls: ["https://polygonscan.com/"],
                  },
                ],
              });
            } else {
              toast.error("Error adding Polygon Chain");
              throw switchError;
            }
          }
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI.abi,
          signer,
        );
        const contractERC20Instance = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractERC20ABI,
          signer,
        );

        set({
          provider,
          signer,
          account: address,
          contract: contractInstance,
          contractERC20: contractERC20Instance,
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
}));

export default useSmartContractStore;
