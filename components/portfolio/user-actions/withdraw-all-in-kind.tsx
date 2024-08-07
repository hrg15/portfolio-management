"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { usePortfolioEndpoints } from "@/lib/smart-contract/endpoints/portfolio/portfolio-hooks";
import { useState } from "react";
import { toast } from "sonner";

const WithdrawAllInKind = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { withdrawAllInKind } = usePortfolioEndpoints();

  const handleWithdraw = async () => {
    const result = await withdrawAllInKind();
    console.log("result");
    if (result) {
      toast.success("Withdraw complete successfully!");
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
