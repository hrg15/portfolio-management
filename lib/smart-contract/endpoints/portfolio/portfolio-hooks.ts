import { useCallback } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";
import useSmartContractStore from "../../use-smart-contract";

export const usePortfolioEndpoints = () => {
  const { contract, isWalletConnected, connectWallet, account } =
    useSmartContractStore();

  const ensureConnection = useCallback(async () => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first");
      await connectWallet();
      return false;
    }
    if (!contract) {
      toast.error("Contract not initialized. Please deploy the contract first");
      return false;
    }
    return true;
  }, [isWalletConnected, contract, connectWallet]);

  const userWithdraw = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.withdraw();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return null;
    }
  }, [contract, account, ensureConnection]);

  const userDeposit = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.withdraw();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return null;
    }
  }, [contract, account, ensureConnection]);

  const portfolioList = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.portfolioList();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return null;
    }
  }, [contract, account, ensureConnection]);

  return {
    userWithdraw,
    userDeposit,
    portfolioList,
  };
};
