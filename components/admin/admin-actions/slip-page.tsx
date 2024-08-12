"use client";

import NumberInput from "@/components/number-input";
import QuickPercentSlider from "@/components/quick-percent-slider";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "sonner";

const SlipPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("0");
  const [calculatedPercent, setCalculatedPercent] = useState(0);

  const { updateSlippageTolerance } = useAdminEndpoints();
  const { isWalletConnected } = useSmartContractStore();

  const handlePercentChange = (percent: number | string) => {
    if (+percent > 100) {
      setCalculatedPercent(100);
    } else {
      setCalculatedPercent(+percent);
    }
  };

  const handleDeposit = async () => {
    const percentage = calculatedPercent * 100;
    try {
      const result = await updateSlippageTolerance(percentage);
      setIsOpen(false);
    } catch (error) {
      console.log("error:" + error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Slip page"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Slip Page
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center"> Please enter the desired percentage:</div>
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
          <Button onClick={handleDeposit}>Confirm</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default SlipPage;
