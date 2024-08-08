"use client";

import Loading from "@/components/loading";
import { CODE_BYTES } from "@/config";
import useIsomorphicLayoutEffect from "@/lib/hooks/use-isomorphic-layout-effect";
import { Routes } from "@/lib/routes";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { useRouter } from "next/navigation";

export default function Home() {
  const { contract, signer, isWalletConnected, connectWallet } =
    useSmartContractStore();
  const { checkAdminRole } = useAdminEndpoints();
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    const adminRoleCheck = async () => {
      if (contract && signer) {
        const signerAddress = await signer.getAddress();
        const isAdmin = await checkAdminRole(CODE_BYTES, signerAddress);
        if (isAdmin) {
          router.push(Routes.Admin);
        } else {
          router.push(Routes.Portfolio);
        }
      } else {
        await connectWallet();
      }
    };

    adminRoleCheck();
  }, [isWalletConnected]);

  return <Loading />;
}
