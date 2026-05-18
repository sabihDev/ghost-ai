import type { ReactNode } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface EditorDialogPatternProps {
  title: string;
  description: string;
  children?: ReactNode;
  footerActions?: ReactNode;
  className?: string;
}

export function EditorDialogPattern({
  title,
  description,
  children,
  footerActions,
  className,
}: EditorDialogPatternProps) {
  return (
    <DialogContent
      className={cn(
        "rounded-3xl border border-surface-border bg-elevated p-6 text-copy-primary shadow-2xl sm:max-w-md",
        className
      )}
    >
      <DialogHeader>
        <DialogTitle className="text-copy-primary">{title}</DialogTitle>
        <DialogDescription className="text-copy-muted">
          {description}
        </DialogDescription>
      </DialogHeader>

      {children}

      {footerActions ? (
        <DialogFooter className="-mx-6 -mb-6 border-surface-border bg-surface p-6">
          {footerActions}
        </DialogFooter>
      ) : null}
    </DialogContent>
  );
}
