"use client";

import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

function EmptyProjectsState({ label }: { label: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/50 px-6 text-center">
      <p className="text-sm text-copy-muted">{label}</p>
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  className,
}: ProjectSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-4 top-18 z-40 flex h-[calc(100vh-5rem)] w-80 flex-col rounded-2xl border border-sidebar-border bg-sidebar p-4 shadow-2xl backdrop-blur-md transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]",
        className
      )}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-copy-primary">Projects</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Close project sidebar"
          onClick={onClose}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>

      <Tabs defaultValue="my-projects" className="mt-4 min-h-0 flex-1">
        <TabsList className="grid w-full grid-cols-2 bg-subtle">
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="my-projects" className="mt-4">
          <EmptyProjectsState label="No projects yet." />
        </TabsContent>
        <TabsContent value="shared" className="mt-4">
          <EmptyProjectsState label="No shared projects yet." />
        </TabsContent>
      </Tabs>

      <Button type="button" className="mt-4 w-full">
        <Plus className="h-4 w-4" aria-hidden="true" />
        New Project
      </Button>
    </aside>
  );
}
