import { useCallback } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";
import useSmartContractStore from "../../use-smart-contract";
import { number } from "zod";
interface IBytes {
  pairAddress: string[];
  tokens: string[];
  version: string | number;
}
export const usePortfolioEndpoints = () => {
  const { contract, isWalletConnected, connectWallet } =
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

  const withdrawAllInKind = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.withdrawAllInKind();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return null;
    }
  }, [contract, ensureConnection]);

  const portfolioList = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.portfolioList();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return null;
    }
  }, [contract, ensureConnection]);

  const userWithdrawWholeFundWETH = useCallback(
    async (bytes: IBytes, percentage: number) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.userWithdrawWholeFundWETH();
        return result;
      } catch (error) {
        console.log(`Error : ${(error as Error).message}`);
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const deposit = useCallback(
    async (ethAmount: number, bytes: IBytes) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.deposit();
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        return null;
      }
    },
    [contract, ensureConnection],
  );

  return {
    withdrawAllInKind,
    deposit,
    portfolioList,
    userWithdrawWholeFundWETH,
  };
};
