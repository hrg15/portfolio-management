import { useCallback } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";
import useSmartContractStore from "../../use-smart-contract";

export const useAdminEndpoints = () => {
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

  const checkAdminRole = useCallback(
    async (codeBytes: string, signer: string): Promise<boolean> => {
      if (!(await ensureConnection())) return false;

      try {
        const admin = await contract?.hasRole(codeBytes, signer);
        if (admin) {
          console.log("admin", admin);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        return false;
      }
    },
    [contract, account, ensureConnection],
  );

  const deposit = useCallback(
    async (amount: string): Promise<string | null> => {
      if (!(await ensureConnection())) return null;

      try {
        const tx = await contract?.deposit({
          value: ethers.parseEther(amount),
        });
        await tx.wait();
        const newBalance = await contract?.balanceOf(account);
        return ethers.formatEther(newBalance);
      } catch (error) {
        toast.error(`Deposit failed: ${(error as Error).message}`);
        return null;
      }
    },
    [contract, account, ensureConnection],
  );

  const withdraw = useCallback(
    async (amount: string, toAddress?: string): Promise<string | null> => {
      if (!(await ensureConnection())) return null;

      try {
        let tx;
        if (toAddress) {
          tx = await contract?.withdrawTo(toAddress, ethers.parseEther(amount));
        } else {
          tx = await contract?.withdraw(ethers.parseEther(amount));
        }
        await tx.wait();
        const newBalance = await contract?.balanceOf(account);
        return ethers.formatEther(newBalance);
      } catch (error) {
        toast.error(`Withdrawal failed: ${(error as Error).message}`);
        return null;
      }
    },
    [contract, account, ensureConnection],
  );

  const getUSDTName = useCallback(async (): Promise<string | null> => {
    if (!(await ensureConnection())) return null;

    try {
      const name = await contract?.name();
      return name;
    } catch (error) {
      toast.error(`Failed to get USDT name: ${(error as Error).message}`);
      return null;
    }
  }, [contract, ensureConnection]);

  return {
    checkAdminRole,
    deposit,
    withdraw,
    getUSDTName,
  };
};
