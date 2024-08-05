import { Input } from "@/components/ui/input";
import { numberInputSanitizer } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface NumberInputProps {
  name: string;
  value: string;
  onIncrement?: () => any;
  onDecrement?: () => any;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  placeholder?: string;
  error?: boolean;
  label?: string;
  classNames?: string;
  inputClass?: string;
  maxPrecision: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
  name,
  value,
  onIncrement,
  onDecrement,
  disabled,
  placeholder,
  error,
  onChange,
  label,
  maxPrecision,
  classNames,
  inputClass,
}) => {
  return (
    <div
      className={`focus-within:outline-primary-400 flex items-center justify-between rounded-3xl bg-neutral-200 px-3 outline outline-2 outline-transparent transition-colors hover:outline-neutral-300 dark:bg-black-3 hover:dark:outline-neutral-600 md:rounded-md ${
        disabled ? "opacity-50" : ""
      } ${error ? "!bg-error/20" : ""} ${classNames || ""} `}
    >
      {label && <div className="mr-1">{label}</div>}
      {onDecrement && (
        <button
          disabled={disabled}
          className="h-auto text-neutral-500"
          onClick={onDecrement}
        >
          <Minus size={20} />
        </button>
      )}
      <Input
        inputMode="decimal"
        className={`text-md h-auto border-0 !bg-transparent py-0 text-center text-neutral-800 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-neutral-200 ${
          inputClass || ""
        }`}
        name={name}
        value={value}
        disabled={disabled}
        placeholder={placeholder || ""}
        onChange={(e) => numberInputSanitizer(e, onChange, maxPrecision)}
        maxLength={20}
      />
      {onIncrement && (
        <button
          disabled={disabled}
          className="h-auto text-neutral-500"
          onClick={onIncrement}
        >
          <Plus size={20} />
        </button>
      )}
    </div>
  );
};

export default NumberInput;
