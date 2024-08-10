import { ResponsiveDialog } from "@/components/responsive-dialog";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { CHAIN_ID, QUOTE_T0KEN } from "@/config";
import { IPairs } from "@/lib/endpoints/schemas";
import { tokensHooks } from "@/lib/endpoints/tokens-endpoints";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { filterTokenPairs } from "@/lib/utils";
import { AbiCoder } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DoRebalance = () => {
  const [pairTokens, setPairTokens] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);

  const { doRebalance, tokensList } = useAdminEndpoints();
  const { contract, isWalletConnected } = useSmartContractStore();

  const { data, isLoading } = tokensHooks.useQueryPairTokens(
    {
      params: {
        token: tokens.join(","),
      },
    },
    {
      enabled: isOpen,
    },
  );

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

  useEffect(() => {
    if (data?.pairs) {
      setPairTokens(filterTokenPairs(data.pairs, tokens));
    }
  }, [data?.pairs, tokens]);

  const handleRebalance = async () => {
    const version = tokens.map((t) => "3");
    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(
      ["address[]", "address[]", "string[]"],
      [pairTokens, tokens, version],
    );
    try {
      const result = await doRebalance(encodedData);
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
          <Button
            disabled={isLoading || isLoadingTokens}
            onClick={handleRebalance}
          >
            {isLoading || isLoadingTokens ? (
              <Spinner variant="secondary" />
            ) : (
              "Rebalance"
            )}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default DoRebalance;
