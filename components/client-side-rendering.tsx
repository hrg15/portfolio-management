"use client";

import useIsomorphicLayoutEffect from "@/lib/hooks/use-isomorphic-layout-effect";
import { useState } from "react";

export default function ClientSideRendering({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSSR, setIsSSR] = useState(true);

  useIsomorphicLayoutEffect(() => {
    setIsSSR(false);
  }, []);

  return isSSR ? null : children;
}
