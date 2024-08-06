"use client";

import { Button } from "../ui/button";
import { ResponsiveDialog } from "../responsive-dialog";
import QuickPercentSlider from "../quick-percent-slider";
import { calculateProportion, roundDown, times } from "@/lib/math";
import { useState } from "react";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { toast } from "sonner";

const AdminActions = () => {
  const [calculatedPercent, setCalculatedPercent] = useState(0);

  const handlePercentChange = (percent: number) => {
    const amountToPay = calculateProportion(1, percent);

    const total = roundDown(times(amountToPay, 1), 1);
    console.log(total);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <WithdrawWholeFund />
      <EmergencyWithdrawToETH />
      <EmergencyWithdrawToToken />
      <LiquidateContract />
    </div>
  );
};
export default AdminActions;

const WithdrawWholeFund = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { adminWithdrawWholeFund } = useAdminEndpoints();

  const handleWithdraw = async () => {
    const result = await adminWithdrawWholeFund();
    if (result) {
      toast.success("Withdraw complete successfully!");
    }
  };
  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Withdraw whole fund"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Withdraw whole fund
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">Are sure to Withdraw whole fund</div>
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
const EmergencyWithdrawToETH = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { adminWithdrawWholeFundWETH } = useAdminEndpoints();

  const handleWithdraw = async () => {
    const result = await adminWithdrawWholeFundWETH();
    if (result) {
      toast.success("Withdraw complete successfully!");
    }
  };
  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Emergency Withdraw to ETH"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Emergency Withdraw to ETH
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">Are sure to Emergency Withdraw to ETH</div>
        {/* <QuickPercentSlider
            side={"buy"}
            percent={calculatedPercent}
            setPercent={handlePercentChange}
            disabled={false}
            className="order-4"
          /> */}
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
const EmergencyWithdrawToToken = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { adminWithdrawWholeFundTokens } = useAdminEndpoints();

  const handleWithdraw = async () => {
    const result = await adminWithdrawWholeFundTokens();
    if (result) {
      toast.success("Withdraw complete successfully!");
    }
  };
  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Emergency Withdraw to Token"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Emergency Withdraw to Token
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">
          Are sure to Emergency Withdraw to Token
        </div>
        {/* <QuickPercentSlider
            side={"buy"}
            percent={calculatedPercent}
            setPercent={handlePercentChange}
            disabled={false}
            className="order-4"
          /> */}
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
const LiquidateContract = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { adminLiquidate } = useAdminEndpoints();

  const handleLiquidate = async () => {
    const result = await adminLiquidate();
    if (result) {
      toast.success("Liquidate complete successfully!");
    }
  };
  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Liquidate contract"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Liquidate contract
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">Liquidate contract</div>
        {/* <QuickPercentSlider
            side={"buy"}
            percent={calculatedPercent}
            setPercent={handlePercentChange}
            disabled={false}
            className="order-4"
          /> */}
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
          <Button onClick={handleLiquidate}>Confirm</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};
