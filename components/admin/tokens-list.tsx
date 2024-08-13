"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { ResponsiveDialog } from "../responsive-dialog";
import { tokensHooks } from "@/lib/endpoints/tokens-endpoints";
import { IPairs } from "@/lib/endpoints/schemas";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface IBaseToke {
  address: string;
  name: string;
  symbol: string;
}

const TokensList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<any[]>([]);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<number[] | null>([]);

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

  const { data, isLoading: tokensDataIsLoading } =
    tokensHooks.useQueryPairTokens(
      {
        params: {
          token: tokens.join(","),
        },
      },
      {
        enabled: tokens.length > 0,
      },
    );

  function handleUniqueBaseTokens(pairs: IPairs[]): IBaseToke[] {
    const uniqueTokens: { [key: string]: IBaseToke } = {};
    pairs.forEach(({ baseToken }) => {
      const key = baseToken.address;
      if (!uniqueTokens[key]) {
        uniqueTokens[key] = baseToken;
      }
    });

    return Object.values(uniqueTokens).map((uniqueTokens) => uniqueTokens);
  }

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
              <TableHead className="">Symbol</TableHead>
              <TableHead className="">Name</TableHead>
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
              handleUniqueBaseTokens(data?.pairs || []).map((token, index) => {
                return (
                  <SingleTokenRow
                    key={token.address}
                    token={token}
                    index={index}
                    setIsRemoveDialogOpen={setIsRemoveDialogOpen}
                    setSelectedToken={setSelectedToken}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <AddTokenDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <RemoveTokenDialog
        token={selectedToken || []}
        isOpen={isRemoveDialogOpen}
        setIsOpen={setIsRemoveDialogOpen}
      />
    </>
  );
};

export default TokensList;

const SingleTokenRow = ({
  token,
  index,
  setIsRemoveDialogOpen,
  setSelectedToken,
}: {
  token: IBaseToke;
  index: number;
  setIsRemoveDialogOpen: (val: boolean) => void;
  setSelectedToken: (val: number[]) => void;
}) => {
  const handleOpenDialog = (tokenIndex: number) => {
    setSelectedToken([tokenIndex]);
    setIsRemoveDialogOpen(true);
  };
  return (
    <TableRow>
      <TableCell className="font-medium">{token.symbol}</TableCell>
      <TableCell className="font-medium">{token.name}</TableCell>
      <TableCell className="font-medium">{token.address}</TableCell>
      {/* <TableCell className="text-right">
        <button onClick={() => handleOpenDialog(index)}>
          <DeleteIcon className="size-6 hover:text-error" />
        </button>
      </TableCell> */}
    </TableRow>
  );
};

const AddTokenDialog = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const [inputs, setInputs] = useState(1);
  const [addresses, setAddresses] = useState<string[]>([""]);
  const [fees, setFees] = useState<number[]>([0]);
  const [versions, setVersions] = useState<string[]>([""]);
  const [percentages, setPercentages] = useState<number[]>([0]);

  const { addNewTokens } = useAdminEndpoints();

  const handleInputChange = (index: number, value: string) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };
  const handleFeesChange = (index: number, value: number) => {
    const newArray = [...fees];
    newArray[index] = value;
    setFees(newArray);
  };
  const handlePercentChange = (index: number, value: number) => {
    const newArray = [...percentages];
    newArray[index] = value * 100;
    setPercentages(newArray);
  };
  const handleVersionChange = (index: number, value: string) => {
    const newArray = [...versions];
    newArray[index] = value;
    setVersions(newArray);
  };

  const addAddress = () => {
    setInputs(inputs + 1);
    setAddresses([...addresses, ""]);
    setFees([...fees, 0]);
    setPercentages([...percentages, 0]);
  };

  const removeAddress = (index: number) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    const newFees = fees.filter((_, i) => i !== index);
    const newPercentages = percentages.filter((_, i) => i !== index);
    const newVersions = versions.filter((_, i) => i !== index);
    setAddresses(newAddresses);
    setFees(newFees);
    setPercentages(newPercentages);
    setVersions(newVersions);
    setInputs(inputs - 1);
  };

  const handleSubmitAddToken = async () => {
    console.log([addresses, percentages, versions, fees]);
    // if (!!addresses.length) {
    //   const result = await addNewTokens(addresses, percentages, versions, fees);
    //   setIsOpen(false);
    // }
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
            <div
              key={index}
              className="rounded-xl border border-neutral-600 p-3"
            >
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Address ${index + 1}`}
                />
                <Input
                  type="text"
                  // defaultValue={percentages[index] / 100}
                  onChange={(e) => handlePercentChange(index, +e.target.value)}
                  placeholder={`%`}
                  className="w-1/3"
                />
              </div>
              <div className="my-4 flex items-center gap-2">
                <Input
                  type="text"
                  // defaultValue={fees[index]}
                  onChange={(e) => handleFeesChange(index, +e.target.value)}
                  placeholder={`Fee`}
                />
                <Select
                  onValueChange={(value) => handleVersionChange(index, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Version" />
                  </SelectTrigger>
                  <SelectContent className="dark">
                    <SelectGroup>
                      <SelectLabel>Version</SelectLabel>
                      <SelectItem value="v2">2</SelectItem>
                      <SelectItem value="v3">3</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
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

const RemoveTokenDialog = ({
  isOpen,
  setIsOpen,
  token,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  token: number[];
}) => {
  const { removeTokens } = useAdminEndpoints();

  const handleDeleteToken = async () => {
    try {
      const result = await removeTokens(token);
      setIsOpen(false);
    } catch (error) {
      console.log("Error remove Token", error);
    }
  };

  return (
    <ResponsiveDialog open={isOpen} setOpen={setIsOpen} title="Remove Token">
      <div className="space-y-4">
        <div className="text-center">Are sure to remove this token?</div>
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
          <Button onClick={handleDeleteToken}>Remove</Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
};
