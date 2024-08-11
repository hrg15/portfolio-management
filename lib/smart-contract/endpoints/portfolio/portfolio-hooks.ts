import { useCallback } from "react";
import { toast } from "sonner";
import { ethers, Transaction } from "ethers";
import useSmartContractStore from "../../use-smart-contract";
import { number } from "zod";
import { CONTRACT_ADDRESS } from "@/config";
import handleErrors from "@/components/handle-errors";
interface IBytes {
  pairAddress: string[];
  tokens: string[];
  version: string | number;
}
export const usePortfolioEndpoints = () => {
  const { contract, isWalletConnected, connectWallet, account, signer } =
    useSmartContractStore();

  const ensureConnection = useCallback(async () => {
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first");
      // await connectWallet();
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
      console.log(`Error : ${(error as Error).message}`);
      handleErrors(error + "");
      return null;
    }
  }, [contract, ensureConnection]);

  const userWithdrawWholeFundWETH = useCallback(
    async (bytes: any, percentage: number) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.userWithdrawWholeFundWETH(
          bytes,
          percentage,
        );
        return result;
      } catch (error) {
        console.log(`Error : ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const deposit = useCallback(
    async (ethAmount: any, bytes: any, currentGas: any) => {
      if (!(await ensureConnection())) return false;

      try {
        const deposit = await contract?.deposit(ethAmount, bytes, {
          value: ethAmount,
          gasLimit: 300000,
          // gasPrice: currentGas,
        });
        return deposit;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );

  return {
    withdrawAllInKind,
    deposit,
    userWithdrawWholeFundWETH,
  };
};
