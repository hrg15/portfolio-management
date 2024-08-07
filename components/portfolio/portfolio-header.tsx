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
import { usePortfolioEndpoints } from "@/lib/smart-contract/endpoints/portfolio/portfolio-hooks";
import { MetamaskIcon } from "../icons/icons";
import UserActions from "./user-actions/user-actions";

const PortfolioHeader = () => {
  const { connectWallet, error, isWalletConnected } = useSmartContractStore();

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
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <h1 className="hidden text-2xl font-bold text-white md:block">
              Portfolio ReBalancer
            </h1>
            <button className="relative" onClick={() => connectWallet()}>
              <MetamaskIcon className="size-10" />
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
            <Image
              alt="Logo"
              src="/assets/eth.png"
              width={80}
              height={80}
              style={{ width: "auto", height: "auto" }}
            />
            <div className="my-20 block space-y-4">
              <h2 className="text-2xl font-semibold sm:text-4xl">
                Rebalance Portfolio
              </h2>
              <p className="text-sm font-light sm:text-base">
                This contract allows for the formation and rebalancing of a
                crypto portfolio on Ethereum L1.
              </p>
            </div>
            <UserActions />
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioHeader;
