import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";

function range(n: number): number[] {
  let arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(i);
  }
  return arr;
}

export default function QuickPercentSlider({
  percent: _percent,
  setPercent,
  disabled,
  side,
  max,
  min,
  hidePercentSymbol,
  pointCount = 5,
  className = "",
}: {
  percent: number;
  setPercent: (percent: number) => any;
  disabled: boolean;
  side: string;
  max?: number;
  min?: number;
  hidePercentSymbol?: boolean;
  pointCount?: number;
  className?: string;
}) {
  const maximum = max ? max : 100;
  const minimum = min ? min : 0;
  const length = maximum - minimum;

  const listButtons = range(pointCount);

  const percent = Math.min(_percent, max || 100);

  return (
    <div className={cn("relative w-full", className)}>
      {listButtons.map((num) => {
        const leftPercent =
          ((length * (num / (pointCount - 1))) / length) * 100;

        let style = {};

        if (leftPercent === 100) {
          style = {
            right: "0",
          };
        } else if (num >= Math.floor(pointCount / 2) && num < pointCount - 1) {
          style = {
            left: `${leftPercent - 2}%`,
          };
        } else {
          style = {
            left: `${leftPercent}%`,
          };
        }

        return (
          <div
            key={num}
            onClick={() =>
              setPercent(
                Math.floor(minimum + length * (num / (pointCount - 1))),
              )
            }
            className={`${
              percent <= length * (num / (pointCount - 1))
                ? "bg-neutral-300 dark:border-neutral-600 dark:bg-neutral-800"
                : ` ${
                    side === "sell" ? "!bg-[#F6465D]" : "!bg-[#0ECB81]"
                  } dark:border-neutral-600`
            } absolute top-1/2 z-10 block h-3 w-3 -translate-y-1/2 rotate-45 cursor-pointer rounded-full border-2 border-neutral-50 p-0.5 transition-colors disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-600`}
            style={style}
          />
        );
      })}

      <Slider
        side={side}
        defaultValue={[percent]}
        value={[percent]}
        onValueChange={(numberList) => setPercent(numberList[0])}
        max={maximum}
        min={minimum}
        step={1}
        disabled={disabled}
        aria-label={hidePercentSymbol ? "hidden" : ""}
        className={`relative my-6 rounded-full bg-neutral-200 ${
          side === "sell" ? "text-[#F6465D]" : "text-[#0ECB81]"
        } dark:bg-neutral-600 [&>span:last-child]:z-20`}
      />
    </div>
  );
}
