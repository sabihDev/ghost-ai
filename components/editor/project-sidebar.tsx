"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";

import { type MockProject } from "@/components/editor/use-project-dialogs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  projects: MockProject[];
  onClose: () => void;
  onCreateProject: () => void;
  onDeleteProject: (project: MockProject) => void;
  onRenameProject: (project: MockProject) => void;
  className?: string;
}

interface ProjectListProps {
  emptyLabel: string;
  projects: MockProject[];
  onDeleteProject: (project: MockProject) => void;
  onRenameProject: (project: MockProject) => void;
}

function EmptyProjectsState({ label }: { label: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/50 px-6 text-center">
      <p className="text-sm text-copy-muted">{label}</p>
    </div>
  );
}

function ProjectList({
  emptyLabel,
  projects,
  onDeleteProject,
  onRenameProject,
}: ProjectListProps) {
  if (projects.length === 0) {
    return <EmptyProjectsState label={emptyLabel} />;
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => {
        const isOwned = project.access === "owned";

        return (
          <div
            key={project.id}
            className="flex min-h-16 items-center gap-3 rounded-2xl border border-surface-border bg-subtle/60 px-3 py-2"
          >
            <button
              type="button"
              className="min-w-0 flex-1 text-left"
              aria-label={`Open ${project.name}`}
            >
              <span className="block truncate text-sm font-medium text-copy-primary">
                {project.name}
              </span>
              <span className="mt-1 block truncate font-mono text-xs text-copy-muted">
                {project.slug}
              </span>
              <span className="mt-1 block truncate text-xs text-copy-faint">
                {project.updatedAt}
              </span>
            </button>

            {isOwned ? (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Rename ${project.name}`}
                  onClick={() => onRenameProject(project)}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Delete ${project.name}`}
                  onClick={() => onDeleteProject(project)}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function ProjectSidebar({
  isOpen,
  projects,
  onClose,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
  className,
}: ProjectSidebarProps) {
  const ownedProjects = projects.filter((project) => project.access === "owned");
  const sharedProjects = projects.filter((project) => project.access === "shared");

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-14 z-30 bg-base/70 backdrop-blur-sm md:hidden"
          aria-label="Close project sidebar"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed left-4 top-18 z-40 flex h-[calc(100vh-5rem)] w-[calc(100vw-2rem)] max-w-80 flex-col rounded-2xl border border-sidebar-border bg-sidebar p-4 shadow-2xl backdrop-blur-md transition-transform duration-200 ease-out",
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
          <TabsContent
            value="my-projects"
            className="mt-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1"
          >
            <ProjectList
              emptyLabel="No projects yet."
              projects={ownedProjects}
              onDeleteProject={onDeleteProject}
              onRenameProject={onRenameProject}
            />
          </TabsContent>
          <TabsContent
            value="shared"
            className="mt-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1"
          >
            <ProjectList
              emptyLabel="No shared projects yet."
              projects={sharedProjects}
              onDeleteProject={onDeleteProject}
              onRenameProject={onRenameProject}
            />
          </TabsContent>
        </Tabs>

        <Button type="button" className="mt-4 w-full" onClick={onCreateProject}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Project
        </Button>
      </aside>
    </>
  );
}
