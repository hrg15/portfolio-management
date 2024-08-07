import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { useState } from "react";
import { toast } from "sonner";

const EmergencyWithdrawErc20 = () => {
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
          Withdraw whole found ERC20
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">
          Are sure to Emergency Withdraw to ERC20?
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

export default EmergencyWithdrawErc20;
