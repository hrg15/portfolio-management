"use client";

import React from "react";
import { MetamaskIcon } from "./icons/icons";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { cn } from "@/lib/utils";

const ConnectionButton = () => {
  const { connectWallet, isWalletConnected, disconnect } =
    useSmartContractStore();

  const handleConnection = () => {
    if (isWalletConnected) {
      disconnect();
    } else {
      connectWallet();
    }
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 rounded-full border border-neutral-500 px-3 py-2"
        onClick={handleConnection}
      >
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
    </div>
  );
};

export default ConnectionButton;
