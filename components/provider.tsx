"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./ui/tooltip";
import ClientSideRendering from "./client-side-rendering";
import { queryClient } from "@/lib/query-client";
import useWindowSize from "@/lib/hooks/use-window-size";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const { isMobile } = useWindowSize();

  return (
    <QueryClientProvider client={queryClient}>
      <ClientSideRendering>
        <Toaster
          theme={"dark"}
          position={isMobile ? "top-center" : "bottom-right"}
          key="dark"
          closeButton
          richColors
          toastOptions={{
            style: {
              border: "border 1px solid #242b33",
            },
          }}
          className="!flex"
        />
        <TooltipProvider skipDelayDuration={0} delayDuration={0}>
          {children}
        </TooltipProvider>
      </ClientSideRendering>
    </QueryClientProvider>
  );
}
