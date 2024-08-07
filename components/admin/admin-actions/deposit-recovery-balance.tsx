import {
  EthereumIcon,
  EthereumRectangleIcon,
  MdiEthereum,
} from "@/components/icons/icons";
import NumberInput from "@/components/number-input";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "sonner";

const DepositRecoveryBalance = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      title={"deposit Recovery Balance"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          deposit Recovery Balance
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">
          Are you sure to Deposit Recovery Balance?
        </div>
        <NumberInput
          label={<MdiEthereum className="mr-1 size-8 text-neutral-700" />}
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
          <Button onClick={handleDeposit}>Deposit</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default DepositRecoveryBalance;
