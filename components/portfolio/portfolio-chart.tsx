"use client";

import React, { useEffect, useState } from "react";
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
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { usePortfolioEndpoints } from "@/lib/smart-contract/endpoints/portfolio/portfolio-hooks";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { ethers } from "ethers";
import contractERC20ABI from "@/lib/smart-contract/ERC20_ABI.json";
import { CONTRACT_ADDRESS } from "@/config";

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
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<string[]>([]);

  const { contract, isWalletConnected, contractERC20, provider } =
    useSmartContractStore();

  const { tokensList } = useAdminEndpoints();

  useEffect(() => {
    const getTokens = async () => {
      setIsLoading(true);
      if (contract) {
        const result = await tokensList();
        const tokenAddresses = [];
        for (let i = 0; i < result.length; i++) {
          tokenAddresses.push(result[i]);
        }
        setTokens(tokenAddresses);
      }
      setIsLoading(false);
    };

    getTokens();
  }, [isWalletConnected]);

  const getTokenBalance = async (
    provider: any,
    tokenAddress: string,
    abi: any,
  ) => {
    const contract = new ethers.Contract(tokenAddress, abi, provider);
    const balance = await contract.balanceOf(CONTRACT_ADDRESS);
    return balance;
  };

  const getAllTokenBalances = async (
    provider: any,
    tokenAddresses: string[],
    abi: any,
  ) => {
    const balances: { [key: string]: string | {} } = {};

    for (const tokenAddress of tokenAddresses) {
      balances[tokenAddress] = {};
      const balance = await getTokenBalance(provider, tokenAddress, abi);
      balances[tokenAddress] = balance.toString();
    }

    return balances;
  };

  const [balances, setBalances] = useState({});

  useEffect(() => {
    async function fetchBalances() {
      const result = await getAllTokenBalances(
        provider,
        tokens,
        contractERC20ABI,
      );
      setBalances(result);
    }
    if (tokens.length > 0) {
      fetchBalances();
    }
  }, [tokens]);

  // console.log("balances: ", balances);

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
