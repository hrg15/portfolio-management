"use client";

import { MdiEthereum } from "@/components/icons/icons";
import NumberInput from "@/components/number-input";
import QuickPercentSlider from "@/components/quick-percent-slider";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { CHAIN_ID, QUOTE_T0KEN, USDC_T0KEN_PAIR } from "@/config";
import { gasHooks } from "@/lib/endpoints/gas-endpoints";
import { IPairs } from "@/lib/endpoints/schemas";
import { tokensHooks } from "@/lib/endpoints/tokens-endpoints";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { usePortfolioEndpoints } from "@/lib/smart-contract/endpoints/portfolio/portfolio-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { filterTokenPairs, filterUSDCTokenPairs } from "@/lib/utils";
import { AbiCoder, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Deposit = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("0");

  const { contract, isWalletConnected, signer, account } =
    useSmartContractStore();
  const { deposit, balanceOf } = usePortfolioEndpoints();

  const handleDeposit = async () => {
    const amountInWei = ethers.parseEther(depositAmount);
    console.log(amountInWei);
    try {
      const result = await deposit(amountInWei);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Deposit"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Deposit
        </Button>
      }
    >
      <div>
        Please enter the Deposit Amount
        <NumberInput
          label={<MdiEthereum className="mr-1 size-8 text-neutral-700" />}
          maxPrecision={100}
          name="Amount"
          value={depositAmount + ""}
          onChange={(e) => setDepositAmount(e.target.value)}
          onDecrement={() =>
            setDepositAmount((prv) => (+prv > 1 ? (+prv - 1).toString() : "0"))
          }
          onIncrement={() =>
            setDepositAmount((prv) => (+prv >= 0 ? (+prv + 1).toString() : "0"))
          }
          classNames="text-center mb-8 mt-4 h-[40px] line-height-[40px] order-2"
        />
        <div className="mt-6 flex w-full items-center justify-around">
          <Button
            onClick={() => setIsOpen(false)}
            type="button"
            variant="destructive"
          >
            Cancel
          </Button>
          <Button onClick={handleDeposit}>Confirm</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default Deposit;
