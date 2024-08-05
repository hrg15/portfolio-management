"use client";

import useIsomorphicLayoutEffect from "@/lib/hooks/use-isomorphic-layout-effect";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import React, { useState } from "react";
import { toast } from "sonner";
import Loading from "./loading";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { codeBytes } from "@/config";
import { ethers } from "ethers";

const AdminAuth = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { contract, signer, isWalletConnected } = useSmartContractStore();
  const { checkAdminRole } = useAdminEndpoints();

  useIsomorphicLayoutEffect(() => {
    const adminRoleCheck = async () => {
      if (contract && signer) {
        const signerAddress = await signer.getAddress();
        const isAdmin = await checkAdminRole(codeBytes, signerAddress);
        console.log("isAdmin", isAdmin);
      }
    };
    adminRoleCheck();
  }, [isWalletConnected]);

  //   if (isLoading) return <Loading />;

  return children;
};

export default AdminAuth;
