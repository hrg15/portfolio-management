import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TokensList = () => {
  return (
    <div className="w-full">
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
