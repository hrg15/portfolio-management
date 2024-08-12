"use client";

import EmergencyWithdrawToETH from "./emergency-withdraw-eth";
import EmergencyWithdrawErc20 from "./withdraw-whole-found-erc20";
import SetFees from "./set-fees";
import PauseUnpause from "./pause-unpause";
import DoRebalance from "./do-rebalance";
import DepositRecoveryBalance from "./deposit-recovery-balance";
import WithdrawAccumulatedFees from "./withdraw-accumulated-fees";
import GasPrice from "./gas-price";
import SlipPage from "./slip-page";

const AdminActions = () => {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
      <div className="flex flex-wrap items-center gap-3">
        <EmergencyWithdrawErc20 />
        <EmergencyWithdrawToETH />
        <PauseUnpause />
        <DoRebalance />
        <DepositRecoveryBalance />
        <WithdrawAccumulatedFees />
        <SlipPage />
        <GasPrice />
      </div>
      <SetFees />
    </div>
  );
};
export default AdminActions;
