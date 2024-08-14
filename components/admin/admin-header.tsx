"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { cn } from "@/lib/utils";
import AdminActions from "./admin-actions/admin-actions";
import { MetamaskIcon } from "../icons/icons";
import ConnectionButton from "../connection-button";

const AdminHeader = () => {
  const { balance, connectWallet, isWalletConnected, account } =
    useSmartContractStore();

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
                style={{ width: "100%", height: "auto" }}
              />
            </Link>
            <h1 className="hidden text-2xl font-bold text-white md:block">
              Portfolio ReBalancer
            </h1>
            <ConnectionButton />
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
              <h2 className="text-4xl font-semibold">Rebalance Portfolio</h2>
              <p>
                This contract allows for the formation and rebalancing of a
                crypto portfolio on Ethereum L1.
              </p>
            </div>
            <AdminActions />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;
