"use client";

import Loading from "@/components/loading";
import { CODE_BYTES } from "@/config";
import useIsomorphicLayoutEffect from "@/lib/hooks/use-isomorphic-layout-effect";
import { Routes } from "@/lib/routes";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { useRouter } from "next/navigation";

export default function Home() {
  const { contract, signer, isWalletConnected, connectWallet, account } =
    useSmartContractStore();
  const { checkAdminRole } = useAdminEndpoints();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    const adminRoleCheck = async () => {
      if (contract && signer) {
        const isAdmin = await checkAdminRole();
        if (isAdmin === account) {
          router.push(Routes.Admin);
        } else {
          router.push(Routes.Portfolio);
        }
      } else {
        router.push(Routes.Portfolio);
      }
    };

    adminRoleCheck();
  }, [isWalletConnected]);

  return <Loading />;
}
