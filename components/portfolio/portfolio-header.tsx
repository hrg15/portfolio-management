"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../responsive-dialog";

const PortfolioHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState<"WITHDRAW" | "DEPOSIT">(
    "WITHDRAW",
  );
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
            <button>
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
        </div>
      </ResponsiveDialog>
    </>
  );
};

export default PortfolioHeader;
