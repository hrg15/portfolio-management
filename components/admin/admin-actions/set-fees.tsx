"use client";

import { ArrowDownIcon } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NumberInput from "@/components/number-input";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "sonner";

const SetFees = () => {
  const [isDepositFeeOpen, setIsDepositFeeOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isSetFeesOpen, setIsSetFeesOpen] = useState(false);
  return (
    <>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-1">
              Set Fees
              <ArrowDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark">
            <DropdownMenuLabel>Set Fees</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                onClick={() => {
                  setIsSetFeesOpen(true);
                }}
              >
                Set Fees
              </button>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <button
                onClick={() => {
                  setIsDepositFeeOpen(true);
                }}
              >
                Set Deposit Fee
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => {
                  setIsWithdrawOpen(true);
                }}
              >
                Set Withdraw Fee
              </button>
            </DropdownMenuItem> */}
            {/* <DropdownMenuItem>Set Accumulate Fee</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SetDepositFee
        isOpen={isDepositFeeOpen}
        setIsOpen={setIsDepositFeeOpen}
      />
      <SetWithdrawFee isOpen={isWithdrawOpen} setIsOpen={setIsWithdrawOpen} />
      <SetBothFees isOpen={isSetFeesOpen} setIsOpen={setIsSetFeesOpen} />
    </>
  );
};

export default SetFees;

const SetDepositFee = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const [depositAmount, setDepositAmount] = useState("0");
  const { depositRecoveryBalance } = useAdminEndpoints();

  const handleDeposit = async () => {
    const result = await depositRecoveryBalance(
      ethers.parseEther(depositAmount),
    );
    if (result) {
      toast.success("deposit Recovery Balance complete successfully!");
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Set Deposit Fee"}
    >
      <div className="space-y-4">
        <div className="text-center">Please enter deposit fee:</div>
        <NumberInput
          label="Fee"
          maxPrecision={100}
          name="Amount"
          value={depositAmount + ""}
          onChange={(e) => setDepositAmount(e.target.value)}
          onDecrement={() =>
            setDepositAmount((prv) => (+prv > 0 ? (+prv - 1).toString() : "0"))
          }
          onIncrement={() =>
            setDepositAmount((prv) => (+prv >= 0 ? (+prv + 1).toString() : "0"))
          }
          classNames="text-center mb-8 mt-4 h-[40px] line-height-[40px] order-2"
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
          <Button onClick={handleDeposit}>Set Fee</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

const SetBothFees = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const [depositFee, setDepositFee] = useState("0");
  const [withdrawFee, setWithdrawFee] = useState("0");
  const { setFeeData } = useAdminEndpoints();

  const handleSetFees = async () => {
    try {
      const result = await setFeeData(+depositFee, +withdrawFee);
      setIsOpen(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  // const handleChangePercentage = (val:string) => {
  //   if(+val > 100){

  //   }
  //  }

  return (
    <ResponsiveDialog open={isOpen} setOpen={setIsOpen} title={"Set Fees"}>
      <div className="space-y-4">
        <div className="text-center">Please enter fees:</div>
        <NumberInput
          label="Deposit%"
          maxPrecision={100}
          name="Amount"
          value={depositFee + ""}
          onChange={(e) => setDepositFee(e.target.value)}
          onDecrement={() =>
            setDepositFee((prv) => (+prv > 0 ? (+prv - 1).toString() : "0"))
          }
          onIncrement={() =>
            setDepositFee((prv) => (+prv >= 0 ? (+prv + 1).toString() : "0"))
          }
          classNames="text-center mb-8 mt-4 h-[40px] line-height-[40px] order-2"
        />
        <NumberInput
          label="Withdraw%"
          maxPrecision={100}
          name="Amount"
          value={withdrawFee + ""}
          onChange={(e) => setWithdrawFee(e.target.value)}
          onDecrement={() =>
            setWithdrawFee((prv) => (+prv > 0 ? (+prv - 1).toString() : "0"))
          }
          onIncrement={() =>
            setWithdrawFee((prv) => (+prv >= 0 ? (+prv + 1).toString() : "0"))
          }
          classNames="text-center mb-8 mt-4 h-[40px] line-height-[40px] order-2"
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
          <Button onClick={handleSetFees}>Set Fees</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

const SetWithdrawFee = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const [depositAmount, setDepositAmount] = useState("0");
  const { depositRecoveryBalance } = useAdminEndpoints();

  const handleDeposit = async () => {
    try {
      const result = await depositRecoveryBalance(
        ethers.parseEther(depositAmount),
      );
      setIsOpen(false);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Set Withdraw Fee"}
    >
      <div className="space-y-4">
        <div className="text-center">Please enter withdraw fee:</div>
        <NumberInput
          label="Fee"
          maxPrecision={100}
          name="Amount"
          value={depositAmount + ""}
          onChange={(e) => setDepositAmount(e.target.value)}
          onDecrement={() =>
            setDepositAmount((prv) => (+prv > 0 ? (+prv - 1).toString() : "0"))
          }
          onIncrement={() =>
            setDepositAmount((prv) => (+prv >= 0 ? (+prv + 1).toString() : "0"))
          }
          classNames="text-center mb-8 mt-4 h-[40px] line-height-[40px] order-2"
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
          <Button onClick={handleDeposit}>Set Fee</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};
