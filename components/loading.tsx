import { cn } from "@/lib/utils";
import Spinner from "./spinner";

export default function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 backdrop-blur-md", className)}>
      <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2">
        <Spinner variant="secondary" />
      </div>
    </div>
  );
}
