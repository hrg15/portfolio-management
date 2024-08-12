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

interface IBaseToke {
  address: string;
  name: string;
  symbol: string;
}

const TokensList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState<any[]>([]);
  const [tokensMetadata, setTokensMetadata] = useState<any | []>([]);
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

  // const isLoadingTokens = tokensDataIsLoading && tokens.length > 0;

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

  // console.log(handleUniqueBaseTokens(data?.pairs || []));
  // const baseAddresses = data?.pairs?.map((pair) => pair.baseToken.address);
  // console.log(baseAddresses);
  // console.log(tokens);

  // useEffect(() => {
  //   const getTokensMetadata = async () => {
  //     if (tokens.length > 0) {
  //       try {
  //         const result = await getTokenMetadata(tokens);
  //         setTokensMetadata(result?.raw || []);
  //       } catch (error) {
  //         toast.error("Couldn't get tokens.");
  //       }
  //     }
  //   };
  //   getTokensMetadata();
  // }, [tokens]);

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
      <TableCell className="text-right">
        <button onClick={() => handleOpenDialog(index)}>
          <DeleteIcon className="size-6 hover:text-error" />
        </button>
      </TableCell>
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
