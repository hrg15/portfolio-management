import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { useState } from "react";
import { toast } from "sonner";

const WithdrawAccumulatedFees = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { withdrawAccumulatedFees } = useAdminEndpoints();

  const handleWithdraw = async () => {
    if (!input) return;
    try {
      const result = await withdrawAccumulatedFees(input);
      setIsOpen(false);
    } catch (error) {
      console.log("withdrawAccumulatedFees Error: " + error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Withdraw Accumulated Fees"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Withdraw Fees
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">
          Are sure to Withdraw Fees?
          <Input
            className="my-3"
            placeholder="wallet address"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
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

export default WithdrawAccumulatedFees;
