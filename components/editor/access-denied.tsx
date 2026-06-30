import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-base px-6 text-copy-primary">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-surface-border bg-surface">
          <Lock className="h-6 w-6 text-brand" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-semibold tracking-normal">
          Access denied
        </h1>
        <p className="mt-2 text-sm leading-6 text-copy-muted">
          This project is unavailable or you do not have permission to open it.
        </p>
        <Button asChild className="mt-6">
          <Link href="/editor">Back to editor</Link>
        </Button>
      </div>
    </main>
  );
}
