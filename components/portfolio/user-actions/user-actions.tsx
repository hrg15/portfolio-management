import { Button } from "@/components/ui/button";
import React from "react";
import WithdrawWholeFoundEth from "./withdraw-whole-found-eth";
import WithdrawAllInKind from "./withdraw-all-in-kind";
import Deposit from "./deposit";

const UserActions = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <WithdrawWholeFoundEth />
      <WithdrawAllInKind />
      <Deposit />
    </div>
  );
};

export default UserActions;
