"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { usePortfolioEndpoints } from "@/lib/smart-contract/endpoints/portfolio/portfolio-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const WithdrawAllInKind = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  const { contract, isWalletConnected, account } = useSmartContractStore();
  const { withdrawAllInKind, balanceOf } = usePortfolioEndpoints();

  useEffect(() => {
    const getBalanceOfAccount = async () => {
      try {
        const result = await balanceOf(account || "");
        console.log("balance", result);
        setBalance(result);
      } catch (error) {
        console.log("Error: " + error);
      }
    };

    if (account!! && isWalletConnected) {
      getBalanceOfAccount();
    }
  }, [account, isWalletConnected]);

  const handleWithdraw = async () => {
    try {
      const result = await withdrawAllInKind(balance);
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
