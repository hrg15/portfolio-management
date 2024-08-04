"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../responsive-dialog";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import QuickPercentSlider from "../quick-percent-slider";
import { calculateProportion, roundDown, times } from "@/lib/math";

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
  } = useSmartContractStore();
  console.log("contract", contract);
  console.log("account", account);
  console.log("signer", signer);
  console.log("error", error);
  console.log("isConnecting", isConnecting);

  const handlePercentChange = (percent: number) => {
    const amountToPay = calculateProportion(1, percent);

    const total = roundDown(times(amountToPay, 1), 1);
    // console.log(total);
  };
  return (
    <>
      <div className="min-h-[500px] w-full bg-black-4 pb-10 pt-2">
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
            <button onClick={() => connectWallet()}>
              <Image
                alt="Logo"
                src="/assets/metamask-fox.svg"
                width={50}
                height={50}
              />
            </button>
          </div>
          <div className="space-y-12">
            <Image alt="Logo" src="/assets/eth.png" width={80} height={80} />
            <div className="my-20 block space-y-4">
              <h2 className="text-4xl font-semibold">Rebalance Portfolio</h2>
              <p>
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
        <div className="">
          Are sure to {selectedSide === "WITHDRAW" ? "Withdraw" : "Deposit"}
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
