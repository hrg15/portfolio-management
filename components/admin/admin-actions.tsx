"use client";

import { Button } from "../ui/button";
import { ResponsiveDialog } from "../responsive-dialog";
import QuickPercentSlider from "../quick-percent-slider";
import { calculateProportion, roundDown, times } from "@/lib/math";
import { useEffect, useState } from "react";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { toast } from "sonner";
import { tokensHooks } from "@/lib/endpoints/tokens-endpoints";
import { IPairs } from "@/lib/endpoints/schemas";
import { chainId, quoteToken } from "@/config";

const AdminActions = () => {
  const [calculatedPercent, setCalculatedPercent] = useState(0);

  const handlePercentChange = (percent: number) => {
    const amountToPay = calculateProportion(1, percent);

    const total = roundDown(times(amountToPay, 1), 1);
    console.log(total);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* <WithdrawWholeFund /> */}
      <EmergencyWithdrawToToken />
      <EmergencyWithdrawToETH />
      {/* <LiquidateContract /> */}
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

const tokens = [
  "0xbbba073c31bf03b8acf7c28ef0738decf3695683",
  "0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4",
  "0xb7b31a6bc18e48888545ce79e83e06003be70930",
  "0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a",
];

const EmergencyWithdrawToETH = () => {
  const [pairTokens, setPairTokens] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const { adminWithdrawWholeFundWETH } = useAdminEndpoints();

  const filterTokenPairs = (pairs: IPairs[]) => {
    const filteredPairs = pairs.filter(
      (pair) =>
        pair.chainId === chainId &&
        pair.dexId === "uniswap" &&
        pair.quoteToken.symbol === quoteToken,
    );

    let v2Liquidity = 0;
    let v3Liquidity = 0;

    filteredPairs.forEach((pair) => {
      if (pair.labels?.includes("v2")) {
        v2Liquidity += pair.liquidity?.usd || 0;
      } else {
        v3Liquidity += pair.liquidity?.usd || 0;
      }
    });

    const version = v2Liquidity > v3Liquidity ? 2 : 3;
    const pairsAddress = filteredPairs.map((pair) => pair.pairAddress);

    return { version, pairsAddress };
  };

  const { data, isLoading } = tokensHooks.useQueryPairTokens({
    params: {
      token: tokens.join(","),
    },
  });

  useEffect(() => {
    if (data?.pairs) {
      const { pairsAddress, version } = filterTokenPairs(data.pairs);
      setPairTokens(pairsAddress);
    }
  }, [data?.pairs]);

  const handleWithdraw = async () => {
    const bytes = { pairAddress: pairTokens, tokens, version: "3" };
    const result = await adminWithdrawWholeFundWETH(bytes);
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
          Withdraw whole found ERC20
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
