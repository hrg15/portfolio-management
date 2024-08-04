"use client";

import Loading from "@/components/loading";
import useIsomorphicLayoutEffect from "@/lib/hooks/use-isomorphic-layout-effect";
import { Routes } from "@/lib/routes";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useIsomorphicLayoutEffect(() => {
    router.push(Routes.Portfolio);
  }, []);
  return <Loading />;
}
