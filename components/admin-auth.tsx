"use client";

import useIsomorphicLayoutEffect from "@/lib/hooks/use-isomorphic-layout-effect";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import React, { useState } from "react";
import { toast } from "sonner";
import Loading from "./loading";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { CODE_BYTES } from "@/config";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes";

const AdminAuth = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { contract, signer, isWalletConnected, connectWallet, account } =
    useSmartContractStore();
  const { checkAdminRole } = useAdminEndpoints();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    const adminRoleCheck = async () => {
      if (contract && signer) {
        const isAdmin = await checkAdminRole();
        if (isAdmin === account) {
          toast("Welcome, You have admin role!");
          router.push(Routes.Admin);
          setIsLoading(false);
        } else {
          router.push(Routes.Portfolio);
          setIsLoading(false);
        }
      } else {
        router.push(Routes.Portfolio);
        setIsLoading(false);
      }
    };

    adminRoleCheck();
  }, [isWalletConnected]);

  if (isLoading) return <Loading />;

  return children;
};

export default AdminAuth;
