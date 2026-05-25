"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorHomeProps {
  onCreateProject: () => void;
}

export function EditorHome({ onCreateProject }: EditorHomeProps) {
  return (
    <section className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold text-copy-primary md:text-3xl">
          Create a project or open an existing one
        </h1>
        <p className="mt-3 text-sm leading-6 text-copy-secondary">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
        <Button type="button" className="mt-6" onClick={onCreateProject}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Project
        </Button>
      </div>
    </section>
  );
}
