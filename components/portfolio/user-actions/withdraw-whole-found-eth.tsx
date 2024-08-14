"use client";

import NumberInput from "@/components/number-input";
import QuickPercentSlider from "@/components/quick-percent-slider";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { CHAIN_ID, QUOTE_T0KEN, USDC_T0KEN_PAIR } from "@/config";
import { IPairs } from "@/lib/endpoints/schemas";
import { tokensHooks } from "@/lib/endpoints/tokens-endpoints";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { usePortfolioEndpoints } from "@/lib/smart-contract/endpoints/portfolio/portfolio-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { filterTokenPairs, filterUSDCTokenPairs } from "@/lib/utils";
import { AbiCoder, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const WithdrawWholeFoundEth = () => {
  const [pairTokens, setPairTokens] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [usdcPairTokens, setUsdcPairTokens] = useState<string[]>([]);

  const [calculatedPercent, setCalculatedPercent] = useState(0);

  const handlePercentChange = (percent: number | string) => {
    if (+percent > 100) {
      setCalculatedPercent(100);
    } else {
      setCalculatedPercent(+percent);
    }
  };

  const { contract, isWalletConnected, account } = useSmartContractStore();
  const { userWithdrawWholeFundWETH, balanceOf } = usePortfolioEndpoints();

  useEffect(() => {
    const getBalanceOfAccount = async () => {
      if (!account || !isWalletConnected) return;
      setIsLoading(true);
      try {
        const result = await balanceOf(account || "");
        setBalance(result);
      } catch (error) {
        console.log("Error: " + error);
      }
      setIsLoading(false);
    };

    getBalanceOfAccount();
  }, [account, isWalletConnected]);

  // async function calculatePercentageOfBalance(percentage) {
  //   const percentageOfBalance = (balance * percentage) / 100;
  //   return percentageOfBalance;
  // }

  const handleUserWithdrawEth = async () => {
    if (isLoading) return;
    const ethBalance = ethers.formatEther(balance);
    const percentageOfBalance = (+ethBalance * +calculatedPercent) / 100;
    const amount = ethers.parseEther(percentageOfBalance + "");

    try {
      const result = await userWithdrawWholeFundWETH(amount);
      setIsOpen(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Withdraw to ETH"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Withdraw to ETH
        </Button>
      }
    >
      <div>
        Please enter the desired percentage for {"Withdraw Whole Fund ETH"}
        <NumberInput
          label="%"
          maxPrecision={100}
          disabled={!isWalletConnected}
          name="Percent"
          value={
            !isWalletConnected ? "Connect your wallet" : calculatedPercent + ""
          }
          onChange={(e) => handlePercentChange(e.target.value)}
          onDecrement={() =>
            setCalculatedPercent((prv) => (prv > 0 ? prv - 1 : 0))
          }
          onIncrement={() =>
            setCalculatedPercent((prv) => (prv >= 0 ? prv + 1 : 0))
          }
          classNames="text-center mb-8 mt-4 h-[40px] line-height-[40px] order-2"
        />
        <QuickPercentSlider
          side={"buy"}
          percent={calculatedPercent}
          setPercent={handlePercentChange}
          disabled={false}
          className="order-4"
        />
        <div className="mt-6 flex w-full items-center justify-around">
          <Button
            onClick={() => setIsOpen(false)}
            type="button"
            variant="destructive"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} onClick={handleUserWithdrawEth}>
            Confirm
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default WithdrawWholeFoundEth;
