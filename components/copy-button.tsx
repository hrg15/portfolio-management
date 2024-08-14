import { useState } from "react";
import { Button } from "./ui/button";
import { Copy, CopyCheck, SquareCheckBigIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type IProp = {
  text: string;
  iconClassName?: string;
  className?: string;
};

export default function CopyButton({ text, iconClassName, className }: IProp) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = (text: string) => {
    setIsCopied(true);
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("w-fit", className)}
      onClick={() => handleCopyToClipboard(text)}
    >
      {isCopied ? (
        <CopyCheck className={cn("w-4 text-neutral-500", iconClassName)} />
      ) : (
        <Copy className={cn("w-4 text-neutral-500", iconClassName)} />
      )}
    </Button>
  );
}
