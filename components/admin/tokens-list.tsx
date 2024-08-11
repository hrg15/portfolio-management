"use client";

import React, { useEffect, useState } from "react";
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
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { cn } from "@/lib/utils";
import { AddIcon, DeleteIcon } from "../icons/icons";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import Spinner from "../spinner";

const TokensList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<any[]>([]);

  const { contract, isWalletConnected } = useSmartContractStore();
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

  return (
    <>
      <div className="w-full">
        <Button
          className="mb-2 ms-auto flex items-center gap-1"
          size="sm"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add Token
          <AddIcon className="size-5" />
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !tokens.length ? (
              <TableRow className="">
                <TableCell className="flex items-center justify-center text-center">
                  <Spinner variant="secondary" />
                </TableCell>
              </TableRow>
            ) : (
              tokens.map((token, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{token}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AddTokenDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default TokensList;

const AddTokenDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const [inputs, setInputs] = useState(1);
  const [addresses, setAddresses] = useState<string[]>([""]);

  const { addNewTokens } = useAdminEndpoints();

  const handleInputChange = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };

  const addAddress = () => {
    setInputs(inputs + 1);
    setAddresses([...addresses, ""]);
  };

  const removeAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
    setInputs(inputs - 1);
  };

  const handleSubmitAddToken = async () => {
    if (!!addresses.length) {
      const result = await addNewTokens(addresses);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn("sm:max-w-[425px]")}>
        <DialogHeader className="text-center">
          <DialogTitle className="capitalize">Add Token</DialogTitle>
          <DialogDescription>Enter the address of tokens </DialogDescription>
        </DialogHeader>
        <div className="max-h-[450px] space-y-3 overflow-auto">
          {addresses.map((address, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                value={address}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder={`Address ${index + 1}`}
              />
              <button type="button" onClick={() => removeAddress(index)}>
                <DeleteIcon className="size-5 text-error" />
              </button>
            </div>
          ))}
          <Button size="sm" type="button" onClick={addAddress}>
            Add Address
          </Button>
        </div>
        <Button
          onClick={handleSubmitAddToken}
          variant="secondary"
          className="block w-full"
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
