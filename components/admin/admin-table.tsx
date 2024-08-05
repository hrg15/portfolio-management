"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { monthDate } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Routes } from "@/lib/routes";
import WhiteListUsers from "./white-list-users";
import TokensList from "./tokens-list";

const AdminTable = () => {
  const [selectedTab, setSelectedTab] = useState<"wl-users" | "tokens">(
    "wl-users",
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentTab = searchParams.get("tab");
    if (currentTab) {
      setSelectedTab(currentTab as "wl-users" | "tokens");
    }
  }, []);

  const handleChangeCategoryTab = (tab: string) => {
    setSelectedTab(tab as "wl-users" | "tokens");
    router.replace(`${Routes.Admin}?tab=${tab}`, { scroll: false });
  };
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-6">
        <CardTitle className="capitalize">
          {selectedTab === "wl-users" ? "White List Users" : "Tokens"}
        </CardTitle>
        <CardDescription>{monthDate()}</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full flex-col pb-0 md:flex-row">
        <Tabs
          onValueChange={handleChangeCategoryTab}
          defaultValue="wl-users"
          className="w-full"
        >
          <TabsList className="dark justify-start">
            <TabsTrigger className="capitalize" value="wl-users">
              white list users
            </TabsTrigger>
            <TabsTrigger className="capitalize" value="tokens">
              Tokens
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="wl-users">
            <WhiteListUsers />
          </TabsContent>
          <TabsContent value="tokens">
            <TokensList />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminTable;
