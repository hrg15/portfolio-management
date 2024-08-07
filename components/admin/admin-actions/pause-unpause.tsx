import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { useState } from "react";
import { toast } from "sonner";

const PauseUnpause = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pauseOrUnpause } = useAdminEndpoints();

  const handlePause = async (val: boolean) => {
    const result = await pauseOrUnpause(val);
    if (result) {
      toast.success("Pause complete successfully!");
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Pause"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Pause or Unpause
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">Please enter the desired option:</div>
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
          <Button
            className="rounded-full"
            variant="secondary"
            onClick={() => handlePause(false)}
          >
            Un Pause
          </Button>
          <Button onClick={() => handlePause(true)}>Pause</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default PauseUnpause;
