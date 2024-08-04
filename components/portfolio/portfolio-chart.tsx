"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "btc", amount: 50, fill: "#E88C30" },
  { browser: "trx", amount: 10, fill: "#E23670" },
  { browser: "eth", amount: 5, fill: "#2662D9" },
  { browser: "bnb", amount: 5, fill: "#AF57DB" },
  { browser: "other", amount: 30, fill: "#2EB88A" },
];

const chartConfig = {
  btc: {
    label: "Bitcoin %",
    color: "#E88C30",
  },
  trx: {
    label: "Tron %",
    color: "#E23670",
  },
  eth: {
    label: "ETH %",
    color: "#2662D9",
  },
  bnb: {
    label: "BNB %",
    color: "#AF57DB",
  },
  other: {
    label: "Other %",
    color: "#2EB88A",
  },
} satisfies ChartConfig;

const PortfolioChart = () => {
  return (
    <div>
      <Card className="flex flex-col">
        <CardContent className="flex w-full flex-col pb-0 md:flex-row">
          <div className="flex flex-1 flex-col items-center justify-center pt-4">
            <div className="mb-6 text-lg font-medium">Your Tokens</div>
            <div className="grid h-fit grid-cols-3 gap-4">
              {chartData.map((item) => {
                const bg = item.fill;
                return (
                  <div
                    key={item.browser}
                    className="flex h-fit items-center gap-2 capitalize"
                  >
                    <div
                      className={`h-2 w-2 rounded-full`}
                      style={{ backgroundColor: bg }}
                    ></div>
                    {item.browser}
                  </div>
                );
              })}
            </div>
          </div>
          <CartView />
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioChart;

const CartView = () => {
  const totalAmount = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.amount, 0);
  }, []);

  const chartDataWithPercentages = React.useMemo(() => {
    return chartData.map((item) => ({
      ...item,
      percentage: ((item.amount / totalAmount) * 100).toFixed(2),
    }));
  }, [totalAmount]);
  return (
    <div className="flex-1">
      <CardHeader className="items-center pb-0">
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={true}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartDataWithPercentages}
            dataKey="amount"
            nameKey="browser"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalAmount.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Amount
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Moving up 5.2% this month{" "}
          <TrendingUp className="h-4 w-4 text-green-600" />
        </div>
        {/* <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div> */}
      </CardFooter>
    </div>
  );
};
