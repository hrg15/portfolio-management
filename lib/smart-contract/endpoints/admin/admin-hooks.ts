import { useCallback } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";
import useSmartContractStore from "../../use-smart-contract";

interface IBytes {
  pairAddress: string[];
  tokens: string[];
  version: string;
}

export const useAdminEndpoints = () => {
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

  const checkAdminRole = useCallback(
    async (codeBytes: string, signer: string) => {
      if (!(await ensureConnection())) return false;

      try {
        const admin = await contract?.hasRole(codeBytes, signer);
        return admin;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        return false;
      }
    },
    [contract, ensureConnection],
  );

  const addNewTokens = useCallback(
    async (tokenList: string[]) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.addTokens(tokenList);
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        return false;
      }
    },
    [contract, ensureConnection],
  );

  const tokensList = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.tokensList();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return false;
    }
  }, [contract, ensureConnection]);

  const addWhiteListUser = useCallback(
    async (address: string) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.addWhitelisted(address);
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        return false;
      }
    },
    [contract, ensureConnection],
  );

  const adminWithdrawWholeFundTokens = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.adminWithdrawWholeFundTokens();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return;
    }
  }, [contract, ensureConnection]);

  const adminWithdrawWholeFundWETH = useCallback(
    async (bytes: IBytes) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.adminWithdrawWholeFundWETH(
          bytes.pairAddress,
          bytes.tokens,
          bytes.version,
        );
        return result;
      } catch (error) {
        console.log(
          `Admin Withdraw Whole Fund ETH Error: ${(error as Error).message}`,
        );
        toast.error("Admin Withdraw Whole Fund ETH Error");
        return;
      }
    },
    [contract, ensureConnection],
  );

  const adminWithdrawWholeFund = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.adminWithdrawWholeFundWETH();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return;
    }
  }, [contract, ensureConnection]);

  const adminLiquidate = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.liquidate();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return;
    }
  }, [contract, ensureConnection]);

  const pauseOrUnpause = useCallback(
    async (val: boolean) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.pauseOrUnpause(val);
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const doRebalance = useCallback(
    async (bytes: IBytes) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.doRebalance(bytes);
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const depositRecoveryBalance = useCallback(
    async (value: bigint) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.depositRecoveryBalance(value);
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const withdrawAccumulatedFees = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.withdrawAccumulatedFees();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      toast.error("Error occurred please try later");
      return null;
    }
  }, [contract, ensureConnection]);

  const setFeeData = useCallback(
    async (depositFee: number, withdrawFee: number) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.setFeeData(depositFee, withdrawFee);
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        toast.error("Error occurred please try later");
        return null;
      }
    },
    [contract, ensureConnection],
  );

  return {
    checkAdminRole,
    addNewTokens,
    tokensList,
    addWhiteListUser,
    adminWithdrawWholeFundTokens,
    adminWithdrawWholeFundWETH,
    adminWithdrawWholeFund,
    adminLiquidate,
    pauseOrUnpause,
    doRebalance,
    depositRecoveryBalance,
    withdrawAccumulatedFees,
    setFeeData,
  };
};
