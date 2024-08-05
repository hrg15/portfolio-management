"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import { Button } from "../ui/button";
import { ResponsiveDialog } from "../responsive-dialog";

const TokensList = () => {
  const { contract } = useSmartContractStore();

  return (
    <div className="w-full">
      <Button className="mb-2 ms-auto block" size="sm" onClick={() => {}}>
        Add Token
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Symbol</TableHead>
            <TableHead className="w-[100px]">name</TableHead>
            <TableHead className="">Address</TableHead>
            <TableHead className="">Decimals</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">BTC</TableCell>
            <TableCell className="font-medium">Bitcoin</TableCell>
            <TableCell className="font-medium">ajsfhds8saKJOIYd90</TableCell>
            <TableCell className="font-medium">8</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">BTC</TableCell>
            <TableCell className="font-medium">Bitcoin</TableCell>
            <TableCell className="font-medium">ajsfhds8saKJOIYd90</TableCell>
            <TableCell className="font-medium">8</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default TokensList;

const AddTokenDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ResponsiveDialog open={isOpen} setOpen={setIsOpen}>
      <div className=""></div>
    </ResponsiveDialog>
  );
};
