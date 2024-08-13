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

  const withdrawAllInKind = useCallback(
    async (tokenAmount: any) => {
      if (!(await ensureConnection())) return false;

      try {
        const tx = await contract?.withdraw(tokenAmount, {
          gasLimit: 3000000,
        });
        await tx.wait();
      } catch (error) {
        console.log(`Error : ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const userWithdrawWholeFundWETH = useCallback(
    async (amount: any) => {
      if (!(await ensureConnection())) return false;

      try {
        const tx = await contract?.withdrawToETH(amount, {
          gasLimit: 3000000,
        });
        return tx;
      } catch (error) {
        console.log(`Error : ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );
  const balanceOf = useCallback(
    async (address: string) => {
      if (!(await ensureConnection())) return false;

      try {
        const tx = await contract?.balanceOf(address, {
          gasLimit: 3000000,
        });
        return tx;
      } catch (error) {
        console.log(`Error : ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const deposit = useCallback(
    async (ethAmount: any) => {
      if (!(await ensureConnection())) return false;

      try {
        const tx = await contract?.deposit({
          value: ethAmount,
          gasLimit: 3000000,
        });
        await tx.wait();
        toast.success("Deposit was successfully.");
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
    balanceOf,
  };
};
