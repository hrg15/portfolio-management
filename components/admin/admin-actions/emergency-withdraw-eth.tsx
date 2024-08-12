"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { USDC_T0KEN_PAIR } from "@/config";
import { tokensHooks } from "@/lib/endpoints/tokens-endpoints";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { filterTokenPairs, filterUSDCTokenPairs } from "@/lib/utils";
import { AbiCoder, ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EmergencyWithdrawToETH = () => {
  const [pairTokens, setPairTokens] = useState<string[]>([]);
  const [usdcPairTokens, setUsdcPairTokens] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);

  const { adminWithdrawWholeFundWETH, tokensList } = useAdminEndpoints();
  const { contract, isWalletConnected } = useSmartContractStore();

  useEffect(() => {
    const getTokens = async () => {
      setIsLoadingTokens(true);
      if (contract) {
        const result = await tokensList();
        const tokenAddresses = [];
        for (let i = 0; i < result.length; i++) {
          tokenAddresses.push(result[i]);
        }
        setTokens(tokenAddresses);
      }
      setIsLoadingTokens(false);
    };
    getTokens();
  }, [isWalletConnected]);

  const { data, isLoading } = tokensHooks.useQueryPairTokens(
    {
      params: {
        token: tokens.join(","),
      },
    },
    {
      enabled: isOpen && tokens.length > 0,
    },
  );
  const { data: usdcPairs, isLoading: usdcPairsLoading } =
    tokensHooks.useQueryPairTokens(
      {
        params: {
          token: USDC_T0KEN_PAIR,
        },
      },
      {
        enabled: isOpen,
      },
    );

  useEffect(() => {
    if (data?.pairs) {
      setPairTokens(filterTokenPairs(data.pairs, tokens));
    }
  }, [data?.pairs, tokens]);

  useEffect(() => {
    if (usdcPairs?.pairs) {
      setUsdcPairTokens(filterUSDCTokenPairs(usdcPairs.pairs));
    }
  }, [usdcPairs?.pairs, tokens]);

  const handleWithdraw = async () => {
    const pairAddress = [...pairTokens, usdcPairTokens[0]];
    const version = pairAddress.map((t) => "3");
    const types = ["address[]", "uint8[]"];
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(types, [pairAddress, version]);

    try {
      const result = await adminWithdrawWholeFundWETH(encodedData);
      setIsOpen(false);
    } catch (error) {
      console.log("error:" + error);
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
        <div className="text-center">
          Are sure to Emergency Withdraw to ETH?
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
          <Button
            disabled={isLoading || isLoadingTokens || usdcPairsLoading}
            onClick={handleWithdraw}
          >
            {isLoading || isLoadingTokens || usdcPairsLoading ? (
              <Spinner variant="secondary" />
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default EmergencyWithdrawToETH;

// [
//   ["pair address", "usdc pair"],
//   ["3", "3", "3"],
// ]
