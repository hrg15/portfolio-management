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
import { Trash2 } from "lucide-react";
import { DeleteIcon } from "../icons/icons";

const WhiteListUsers = () => {
  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">User 1</TableCell>

            <TableCell className="text-right">
              <button>
                <DeleteIcon className="size-6" />
              </button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">User 1</TableCell>

            <TableCell className="text-right">
              <button>
                <DeleteIcon className="size-6" />
              </button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default WhiteListUsers;
