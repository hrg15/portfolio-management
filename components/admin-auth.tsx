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
    const testCheck = async (codeBytes: string, signer: string) => {
      if (contract) {
        try {
          const admin = await contract.hasRole(codeBytes, signer);
          if (admin) {
            console.log("admin", admin);
          }
        } catch (error) {
          console.log(`Error checking admin role: ${(error as Error).message}`);
          //   return false;
        }
      }
    };

    const adminRoleCheck = async () => {
      if (contract && signer) {
        const signerAddress = await signer.getAddress();
        console.log("signerAddress", signerAddress);
        console.log("codeBytes", codeBytes);
        const isAdmin = await testCheck(codeBytes, signerAddress);
        console.log("isAdmin", isAdmin);
      } else {
        console.log("no signer address");
      }
    };
    adminRoleCheck();
  }, [isWalletConnected]);

  //   if (isLoading) return <Loading />;

  return children;
};

export default AdminAuth;
