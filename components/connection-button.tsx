"use client";

import React from "react";
import { ArrowDownIcon, MetamaskIcon } from "./icons/icons";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const ConnectionButton = () => {
  const { connectWallet, isWalletConnected, disconnect, account } =
    useSmartContractStore();

  const handleConnection = () => {
    if (isWalletConnected) {
      disconnect();
    } else {
      connectWallet();
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-full border border-neutral-500 px-3 py-2">
      <button className="flex items-center gap-2" onClick={handleConnection}>
        <span
          className={cn(
            "flex items-center gap-1 text-sm",
            isWalletConnected && "text-green-500",
          )}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                isWalletConnected ? "animate-ping bg-success" : "bg-error",
              )}
            ></span>
            <span
              className={cn(
                "relative inline-flex h-2 w-2 rounded-full",
                isWalletConnected ? "bg-success" : "bg-error",
              )}
            ></span>
          </span>
          {isWalletConnected ? "Connected" : "Connect"}
        </span>
        <MetamaskIcon className="size-5" />
        <div className="absolute -right-2 -top-2"></div>
      </button>
      {!!account && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1">
              <ArrowDownIcon className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark">
            <DropdownMenuLabel>{account}</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ConnectionButton;
