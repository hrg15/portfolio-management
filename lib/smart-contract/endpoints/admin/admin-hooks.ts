import { useCallback } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";
import useSmartContractStore from "../../use-smart-contract";
import handleErrors from "@/components/handle-errors";

interface IBytes {
  pairAddress: string[];
  tokens: string[];
  version: string;
}

export const useAdminEndpoints = () => {
  const { contract, isWalletConnected, connectWallet, contractERC20 } =
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

  const checkAdminRole = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const admin = await contract?.owner();
      return admin;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return false;
    }
  }, [contract, ensureConnection]);

  const addNewTokens = useCallback(
    async (
      tokens: string[],
      targetPercentages: number[],
      versions: string[],
      feeTiers: number[],
    ) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.bulkAddTokens(
          tokens,
          targetPercentages,
          versions,
          feeTiers,
        );
        return result;
      } catch (error) {
        handleErrors(error + "");
        return false;
      }
    },
    [contract, ensureConnection],
  );

  const tokensList = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.getAllTokens();
      return result;
    } catch (error) {
      handleErrors(error + "");
      return false;
    }
  }, [contract, ensureConnection]);

  const balanceOfToken = useCallback(
    async (token: string) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contractERC20?.balanceOf(token);
        return result;
      } catch (error) {
        console.log(`Error contractERC20: ${(error as Error).message}`);
        return false;
      }
    },
    [contract, ensureConnection, contractERC20],
  );

  const usersList = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.usersList();
      return result;
    } catch (error) {
      console.log(`Error checking admin role: ${(error as Error).message}`);
      return false;
    }
  }, [contract, ensureConnection]);

  const addWhiteListUser = useCallback(
    async (address: string, status: boolean) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.setWhitelist(address, status);
        return result;
      } catch (error) {
        handleErrors(error + "");
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
      handleErrors(error + "");
      return;
    }
  }, [contract, ensureConnection]);

  const adminWithdrawWholeFundWETH = useCallback(async () => {
    if (!(await ensureConnection())) return false;

    try {
      const result = await contract?.withdrawAllToETH({
        gasLimit: 3000000,
      });
      await result.wait();
    } catch (error) {
      console.log(
        `Admin Withdraw Whole Fund ETH Error: ${(error as Error).message}`,
      );
      handleErrors(error + "");
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
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const doRebalance = useCallback(
    async (tokenPrices: number[]) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.rebalance(tokenPrices, {
          gasLimit: 3000000,
        });
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const depositRecoveryBalance = useCallback(
    async (value: bigint) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.depositRecoveryBalance(value, {
          value: value,
          gasLimit: 3000000,
        });
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const withdrawAccumulatedFees = useCallback(
    async (receiverFeeAddress: string) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.withdrawFeesByOwner(receiverFeeAddress, {
          gasLimit: 3000000,
        });
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );

  const setFeeData = useCallback(
    async (depositFee: number, withdrawFee: number) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.setFees(depositFee, withdrawFee, {
          gasLimit: 3000000,
        });
        await result.wait();
        // return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );
  const removeWhitelisted = useCallback(
    async (address: string) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.removeWhitelisted(address);
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );
  const updateSlippageTolerance = useCallback(
    async (percentage: number) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.setSlippageTolerance(percentage, {
          gasLimit: 3000000,
        });
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        handleErrors(error + "");
        return null;
      }
    },
    [contract, ensureConnection],
  );
  const removeTokens = useCallback(
    async (tokenIndex: number[]) => {
      if (!(await ensureConnection())) return false;

      try {
        const result = await contract?.removeTokens(tokenIndex);
        return result;
      } catch (error) {
        console.log(`Error checking admin role: ${(error as Error).message}`);
        handleErrors(error + "");
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
    pauseOrUnpause,
    doRebalance,
    depositRecoveryBalance,
    withdrawAccumulatedFees,
    setFeeData,
    usersList,
    balanceOfToken,
    removeWhitelisted,
    updateSlippageTolerance,
    removeTokens,
  };
};
