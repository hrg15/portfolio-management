"use client";

import useIsomorphicLayoutEffect from "@/lib/hooks/use-isomorphic-layout-effect";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import React, { useState } from "react";
import { toast } from "sonner";
import Loading from "./loading";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { codeBytes } from "@/config";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes";

const AdminAuth = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { contract, signer, isWalletConnected, connectWallet } =
    useSmartContractStore();
  const { checkAdminRole } = useAdminEndpoints();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    const adminRoleCheck = async () => {
      if (contract && signer) {
        const signerAddress = await signer.getAddress();
        const isAdmin = await checkAdminRole(codeBytes, signerAddress);
        if (isAdmin) {
          setIsLoading(false);
        } else {
          toast.error("You don't have admin role.");
          router.push(Routes.Portfolio);
        }
      } else {
        await connectWallet();
      }
    };

    adminRoleCheck();
  }, [isWalletConnected]);

  if (isLoading) return <Loading />;

  return children;
};

export default AdminAuth;
