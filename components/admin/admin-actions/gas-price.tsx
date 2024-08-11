import NumberInput from "@/components/number-input";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { gasHooks } from "@/lib/endpoints/gas-endpoints";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { ethers } from "ethers";
import { useState } from "react";

const GasPrice = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [gasPrice, setGasPrice] = useState("0");

  const setGasPriceMutation = gasHooks.useSetGasPriceMutation();

  const handleSetGasPrice = async () => {
    const gas = ethers.parseUnits(gasPrice, "gwei");
    console.log(gas);
    setGasPriceMutation.mutate({
      key: "GASPRICE",
      value: gas.toString(),
    });
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Gas Price"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Gas Price
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">Please enter thee Gas Price?</div>
        <NumberInput
          label="Gas"
          maxPrecision={100}
          name="Amount"
          value={gasPrice + ""}
          onChange={(e) => setGasPrice(e.target.value)}
          onDecrement={() =>
            setGasPrice((prv) => (+prv > 0 ? (+prv - 1).toString() : "0"))
          }
          onIncrement={() =>
            setGasPrice((prv) => (+prv >= 0 ? (+prv + 1).toString() : "0"))
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
          <Button onClick={handleSetGasPrice}>Confirm</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default GasPrice;
