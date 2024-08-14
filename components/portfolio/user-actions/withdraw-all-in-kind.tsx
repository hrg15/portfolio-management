"use client";

import NumberInput from "@/components/number-input";
import QuickPercentSlider from "@/components/quick-percent-slider";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { usePortfolioEndpoints } from "@/lib/smart-contract/endpoints/portfolio/portfolio-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const WithdrawAllInKind = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [calculatedPercent, setCalculatedPercent] = useState(0);

  const handlePercentChange = (percent: number | string) => {
    if (+percent > 100) {
      setCalculatedPercent(100);
    } else {
      setCalculatedPercent(+percent);
    }
  };

  const { contract, isWalletConnected, account } = useSmartContractStore();
  const { withdrawAllInKind, balanceOf } = usePortfolioEndpoints();

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

  const handleWithdraw = async () => {
    const ethBalance = ethers.formatEther(balance);
    const percentageOfBalance = (+ethBalance * +calculatedPercent) / 100;
    const roundedBalance = percentageOfBalance.toFixed(18);
    console.log("roundedBalance", roundedBalance);
    const amount = ethers.parseEther(roundedBalance);
    console.log("amount", amount);
    try {
      const result = await withdrawAllInKind(amount);
      setIsOpen(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Withdraw"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Withdraw
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">Are sure to Withdraw All In Kind?</div>
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
        <div className="flex w-full items-center justify-around">
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            type="button"
            variant="destructive"
          >
            Cancel
          </Button>
          <Button onClick={handleWithdraw}>Confirm</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default WithdrawAllInKind;
