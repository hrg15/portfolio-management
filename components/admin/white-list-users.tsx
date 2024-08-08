"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddIcon, DeleteIcon } from "../icons/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAdminEndpoints } from "@/lib/smart-contract/endpoints/admin/admin-hooks";
import { toast } from "sonner";
import useSmartContractStore from "@/lib/smart-contract/use-smart-contract";
import Spinner from "../spinner";

const WhiteListUsers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  const { addWhiteListUser, usersList } = useAdminEndpoints();
  const { contract, isWalletConnected } = useSmartContractStore();

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      if (contract) {
        const result = await usersList();
        const userAddress = [];
        for (let i = 0; i < result.length; i++) {
          userAddress.push(result[i]);
        }
        setUsers(userAddress);
      }
      setIsLoading(false);
    };
    getUsers();
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
          Add User
          <AddIcon className="size-5" />
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Users</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !users.length ? (
              <TableRow className="">
                <TableCell className="flex items-center justify-center text-center">
                  <Spinner variant="secondary" />
                </TableCell>
              </TableRow>
            ) : (
              users.map((token, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{token}</TableCell>
                  <TableCell className="text-right">
                    <button>
                      <DeleteIcon className="size-6 hover:text-error" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <AddUserDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default WhiteListUsers;

const AddUserDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const [input, setInput] = useState("");
  const { addWhiteListUser } = useAdminEndpoints();

  const handleInputChange = (value: string) => {
    setInput(value);
  };
  const handleSubmitAddToken = async () => {
    if (!!input) {
      try {
        const result = await addWhiteListUser(input);
        setIsOpen(false);
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={"sm:max-w-[425px]"}>
        <DialogHeader className="text-center">
          <DialogTitle className="capitalize">Add User</DialogTitle>
          <DialogDescription>Enter the address of user</DialogDescription>
        </DialogHeader>
        <div className="max-h-[450px] space-y-3 overflow-auto">
          <Input
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`User Address`}
          />
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
