"use client";

import { MdiEthereum } from "@/components/icons/icons";
import NumberInput from "@/components/number-input";
import QuickPercentSlider from "@/components/quick-percent-slider";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { CHAIN_ID, QUOTE_T0KEN } from "@/config";
import { IPairs } from "@/lib/endpoints/schemas";
import { tokensHooks } from "@/lib/endpoints/tokens-endpoints";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { usePortfolioEndpoints } from "@/lib/smart-contract/endpoints/portfolio/portfolio-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { filterTokenPairs } from "@/lib/utils";
import { AbiCoder, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Deposit = () => {
  const [pairTokens, setPairTokens] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const [tokens, setTokens] = useState<any[]>([]);
  const [depositAmount, setDepositAmount] = useState("0");

  const { contract, isWalletConnected } = useSmartContractStore();
  const { deposit } = usePortfolioEndpoints();
  const { tokensList } = useAdminEndpoints();

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
      enabled: isOpen && isWalletConnected,
    },
  );

  useEffect(() => {
    if (data?.pairs) {
      setPairTokens(filterTokenPairs(data.pairs));
    }
  }, [data?.pairs]);

  const handleDeposit = async () => {
    const version = tokens.map((t) => "3");

    const abiCoder = new AbiCoder();
    const encodedData = abiCoder.encode(
      ["address[]", "address[]", "string[]"],
      [pairTokens, tokens, version],
    );

    try {
      const result = await deposit(
        ethers.parseUnits(depositAmount, "wei"),
        encodedData,
      );
      console.log(ethers.parseUnits(depositAmount, "wei"), encodedData);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      setOpen={setIsOpen}
      title={"Deposit"}
      trigger={
        <Button
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
          variant="outline"
        >
          Deposit
        </Button>
      }
    >
      <div>
        Please enter the Deposit Amount
        <NumberInput
          label={<MdiEthereum className="mr-1 size-8 text-neutral-700" />}
          maxPrecision={100}
          name="Amount"
          value={depositAmount + ""}
          onChange={(e) => setDepositAmount(e.target.value)}
          onDecrement={() =>
            setDepositAmount((prv) => (+prv > 1 ? (+prv - 1).toString() : "0"))
          }
          onIncrement={() =>
            setDepositAmount((prv) => (+prv >= 0 ? (+prv + 1).toString() : "0"))
          }
          classNames="text-center mb-8 mt-4 h-[40px] line-height-[40px] order-2"
        />
        <div className="mt-6 flex w-full items-center justify-around">
          <Button
            onClick={() => setIsOpen(false)}
            type="button"
            variant="destructive"
          >
            Cancel
          </Button>
          <Button
            disabled={!isWalletConnected || isLoading || isLoadingTokens}
            onClick={handleDeposit}
          >
            {!isWalletConnected || isLoading || isLoadingTokens ? (
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

export default Deposit;
