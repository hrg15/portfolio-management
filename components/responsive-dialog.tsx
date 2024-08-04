"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useWindowSize from "@/lib/hooks/use-window-size";
import { cn } from "@/lib/utils";

export function ResponsiveDialog({
  trigger,
  children,
  description,
  title,
  footer,
  open,
  setOpen,
  className,
  onCloseAutoFocus,
}: {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  open: boolean;
  setOpen: (value: boolean) => void;
  className?: string;
  onCloseAutoFocus?: () => void;
}) {
  const { isDesktop } = useWindowSize();

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={cn("sm:max-w-[425px]", className)}
          onCloseAutoFocus={onCloseAutoFocus}
        >
          <DialogHeader className="text-center">
            <DialogTitle className="capitalize">{title}</DialogTitle>
            <DialogDescription>{description} </DialogDescription>
          </DialogHeader>
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent
        className={cn(
          "max-h-[90vh] w-auto rounded-t-2xl !border-none !outline-none !ring-0",
          className,
        )}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <div className="mx-auto h-1 w-12 rounded-full bg-neutral-200"></div>
        <DrawerHeader className="text-center">
          <DrawerTitle className="capitalize">{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-3">{children}</div>
        <DrawerFooter>{footer}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
