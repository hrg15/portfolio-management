"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../responsive-dialog";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import QuickPercentSlider from "../quick-percent-slider";
import { calculateProportion, roundDown, times } from "@/lib/math";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import NumberInput from "../number-input";

const PortfolioHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState<"WITHDRAW" | "DEPOSIT">(
    "WITHDRAW",
  );
  const [calculatedPercent, setCalculatedPercent] = useState(0);
  const {
    balance,
    isConnecting,
    connectWallet,
    account,
    error,
    contract,
    signer,
    isWalletConnected,
  } = useSmartContractStore();

  useEffect(() => {
    const usdtContract = async () => {
      if (contract) {
        try {
          const name = await contract.name();
          console.log("USDT Name:", name);
        } catch (error) {
          console.log("USDT contract not found. catch", error);
        }
      } else {
        console.log(
          "USDT contract not initialized. Please connect wallet first.",
        );
      }
    };

    usdtContract();
  }, [isWalletConnected]);

  const handlePercentChange = (percent: number) => {
    const amountToPay = calculateProportion(1, percent);

    const total = roundDown(times(amountToPay, 1), 1);
    // console.log(total);
  };

  useEffect(() => {
    if (error) {
      toast.error("Error: " + error);
    }
  }, [error]);

  return (
    <>
      <div className="absolute right-0 z-10 h-5 w-full -rotate-[20deg] bg-primary blur-3xl sm:hidden"></div>
      <div className="w-full bg-black-4 pb-28 pt-2 sm:pb-10">
        <div className="container space-y-10">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                alt="Logo"
                src="/assets/logo.png"
                width={110}
                height={50}
              />
            </Link>
            <h1 className="hidden text-2xl font-bold text-white md:block">
              Portfolio ReBalancer
            </h1>
            <button className="relative" onClick={() => connectWallet()}>
              <Image
                alt="Logo"
                src="/assets/metamask-fox.svg"
                width={50}
                height={50}
              />
              <div className="absolute -right-2 -top-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75",
                      isWalletConnected
                        ? "animate-ping bg-sky-400"
                        : "bg-error",
                    )}
                  ></span>
                  <span
                    className={cn(
                      "relative inline-flex h-2 w-2 rounded-full",
                      isWalletConnected ? "bg-sky-500" : "bg-error",
                    )}
                  ></span>
                </span>
              </div>
            </button>
          </div>
          <div className="space-y-12">
            <Image alt="Logo" src="/assets/eth.png" width={80} height={80} />
            <div className="my-20 block space-y-4">
              <h2 className="text-2xl font-semibold sm:text-4xl">
                Rebalance Portfolio
              </h2>
              <p className="text-sm font-light sm:text-base">
                This contract allows for the formation and rebalancing of a
                crypto portfolio on Ethereum L1.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setSelectedSide("WITHDRAW");
                  setIsOpen(true);
                }}
              >
                Withdraw
              </Button>
              <Button
                onClick={() => {
                  setSelectedSide("DEPOSIT");
                  setIsOpen(true);
                }}
                variant="outline"
              >
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ResponsiveDialog
        open={isOpen}
        setOpen={setIsOpen}
        title={selectedSide === "WITHDRAW" ? "Withdraw" : "Deposit"}
      >
        <div className="space-y-4">
          Are sure to {selectedSide === "WITHDRAW" ? "Withdraw" : "Deposit"}
          {/* <NumberInput
          label="Price"
          maxPrecision={quotePrecision}
          disabled={type === "market"}
          name="price"
          value={type === "market" ? "Market" : price}
          onChange={(e) => handlePriceChange(e.target.value)}
          // onDecrement={() =>
          //   setPrice((prv) => (+prv > 0 ? (+prv - 1).toString() : "0"))
          // }
          // onIncrement={() =>
          //   setPrice((prv) => (+prv > 0 ? (+prv + 1).toString() : "0"))
          // }
          classNames="text-center mt-1 h-[40px] line-height-[40px] order-2"
        /> */}
          <QuickPercentSlider
            side={selectedSide === "WITHDRAW" ? "buy" : "sell"}
            percent={calculatedPercent}
            setPercent={handlePercentChange}
            disabled={false}
            className="order-4"
          />
          <div className="flex w-full items-center justify-between">
            <Button variant="destructive">Cancel</Button>
            <Button>Confirm</Button>
          </div>
        </div>
      </ResponsiveDialog>
    </>
  );
};

export default PortfolioHeader;
