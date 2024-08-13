"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { USDC_T0KEN_PAIR } from "@/config";
import { tokensHooks } from "@/lib/endpoints/tokens-endpoints";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import {
  filterBaseTokenPairs,
  filterTokenPairs,
  filterUSDCTokenPairs,
} from "@/lib/utils";
import { AbiCoder } from "ethers";
import { useEffect, useState } from "react";

const DoRebalance = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokensPriceTokens, setTokensPrice] = useState<any[]>([]);

  const { contract, isWalletConnected } = useSmartContractStore();

  const { doRebalance, tokensList } = useAdminEndpoints();

  useEffect(() => {
    const getTokens = async () => {
      setIsLoading(true);
      if (contract) {
        const result = await tokensList();
        const tokenAddresses = [];
        for (let i = 0; i < result.length; i++) {
          tokenAddresses.push(result[i]);
        }
        setTokens(tokenAddresses);
      }
      setIsLoading(false);
    };
    getTokens();
  }, [isWalletConnected]);

  const { data, isLoading: tokensDataIsLoading } =
    tokensHooks.useQueryPairTokens(
      {
        params: {
          token: tokens.join(","),
        },
      },
      {
        enabled: tokens.length > 0,
      },
    );

  useEffect(() => {
    if (data?.pairs) {
      setTokensPrice(filterBaseTokenPairs(data.pairs));
    }
  }, [data?.pairs]);

  const handleRebalance = async () => {
    try {
      console.log(tokensPriceTokens);
      const result = await doRebalance(tokensPriceTokens);
      setIsOpen(false);
    } catch (error) {
      console.log("error:" + error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Rebalance"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Rebalance
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="text-center">Are sure to Rebalance?</div>
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
          <Button disabled={tokensDataIsLoading} onClick={handleRebalance}>
            Rebalance
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default DoRebalance;
