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
import { ResponsiveDialog } from "../responsive-dialog";
import { Switch } from "../ui/switch";

const WhiteListUsers = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  const { removeWhitelisted, usersList } = useAdminEndpoints();
  const { contract, isWalletConnected } = useSmartContractStore();

  // useEffect(() => {
  //   const getUsers = async () => {
  //     setIsLoading(true);
  //     if (contract) {
  //       const result = await usersList();
  //       const userAddress = [];
  //       for (let i = 0; i < result.length; i++) {
  //         userAddress.push(result[i]);
  //       }
  //       setUsers(userAddress);
  //     }
  //     setIsLoading(false);
  //   };
  //   getUsers();
  // }, [isWalletConnected]);

  const handleOpenDialog = (address: string) => {
    setSelectedUser(address);
    setIsRemoveDialogOpen(true);
  };

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
                  {/* <Spinner variant="secondary" /> */}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{user}</TableCell>
                  <TableCell className="text-right">
                    <button onClick={() => handleOpenDialog(user)}>
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
      <RemoveUserDialog
        isOpen={isRemoveDialogOpen}
        setIsOpen={setIsRemoveDialogOpen}
        address={selectedUser || ""}
      />
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
  const [isActive, setIsActive] = useState(true);
  const { addWhiteListUser } = useAdminEndpoints();

  const handleInputChange = (value: string) => {
    setInput(value);
  };
  const handleSubmitAddToken = async () => {
    if (!!input) {
      console.log(input, isActive);
      try {
        const result = await addWhiteListUser(input, isActive);
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
          <div className="flex w-full items-center justify-between">
            <span className="opacity-85s text-sm">Add to white list</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
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

const RemoveUserDialog = ({
  isOpen,
  setIsOpen,
  address,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  address: string;
}) => {
  const { addWhiteListUser } = useAdminEndpoints();

  const handleDeleteUser = async () => {
    try {
      const result = await addWhiteListUser(address, false);
      setIsOpen(false);
    } catch (error) {
      console.log("Error remove user", error);
    }
  };

  return (
    <ResponsiveDialog open={isOpen} setOpen={setIsOpen} title="Remove User">
      <div className="space-y-4">
        <div className="text-center">Are sure to remove this user?</div>
        <div className="flex w-full items-center justify-around">
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            type="button"
            variant="destructive"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteUser}>Remove</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};
