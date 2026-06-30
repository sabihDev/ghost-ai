"use client";

import Link from "next/link";
import { Pencil, Plus, Trash2, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { type EditorProject } from "@/lib/projects";

interface ProjectSidebarProps {
  activeProjectId?: string;
  isOpen: boolean;
  ownedProjects: EditorProject[];
  sharedProjects: EditorProject[];
  onClose: () => void;
  onCreateProject: () => void;
  onDeleteProject: (project: EditorProject) => void;
  onRenameProject: (project: EditorProject) => void;
  onShareProject: (project: EditorProject) => void;
  className?: string;
}

interface ProjectListProps {
  activeProjectId?: string;
  emptyLabel: string;
  projects: EditorProject[];
  onDeleteProject: (project: EditorProject) => void;
  onRenameProject: (project: EditorProject) => void;
  onShareProject: (project: EditorProject) => void;
}

function EmptyProjectsState({ label }: { label: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/50 px-6 text-center">
      <p className="text-sm text-copy-muted">{label}</p>
    </div>
  );
}

function ProjectList({
  activeProjectId,
  emptyLabel,
  projects,
  onDeleteProject,
  onRenameProject,
  onShareProject,
}: ProjectListProps) {
  if (projects.length === 0) {
    return <EmptyProjectsState label={emptyLabel} />;
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => {
        const isOwned = project.access === "owned";
        const isActive = project.id === activeProjectId;

        return (
          <div
            key={project.id}
            className={cn(
              "flex min-h-16 items-center gap-3 rounded-2xl border border-surface-border bg-subtle/60 px-3 py-2",
              isActive && "border-brand bg-accent-dim"
            )}
          >
            <Link
              href={`/editor/${project.id}`}
              className="min-w-0 flex-1 text-left"
              aria-label={`Open ${project.name}`}
            >
              <span className="block truncate text-sm font-medium text-copy-primary">
                {project.name}
              </span>
              <span className="mt-1 block truncate font-mono text-xs text-copy-muted">
                {project.roomId}
              </span>
              <span className="mt-1 block truncate text-xs text-copy-faint">
                {project.updatedAt}
              </span>
            </Link>

            {isOwned ? (
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Manage access for ${project.name}`}
                  onClick={() => onShareProject(project)}
                >
                  <Users className="h-4 w-4" aria-hidden="true" />
                </Button>
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
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`View access for ${project.name}`}
                onClick={() => onShareProject(project)}
              >
                <Users className="h-4 w-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ProjectSidebar({
  activeProjectId,
  isOpen,
  ownedProjects,
  sharedProjects,
  onClose,
  onCreateProject,
  onDeleteProject,
  onRenameProject,
  onShareProject,
  className,
}: ProjectSidebarProps) {
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
            <TabsTrigger value="my-projects">
              My Projects
              <span className="font-mono text-xs text-copy-muted">
                {ownedProjects.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="shared">
              Shared
              <span className="font-mono text-xs text-copy-muted">
                {sharedProjects.length}
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="my-projects"
            className="mt-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1"
          >
            <ProjectList
              activeProjectId={activeProjectId}
              emptyLabel="No projects yet."
              projects={ownedProjects}
              onDeleteProject={onDeleteProject}
              onRenameProject={onRenameProject}
              onShareProject={onShareProject}
            />
          </TabsContent>
          <TabsContent
            value="shared"
            className="mt-4 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1"
          >
            <ProjectList
              activeProjectId={activeProjectId}
              emptyLabel="No shared projects yet."
              projects={sharedProjects}
              onDeleteProject={onDeleteProject}
              onRenameProject={onRenameProject}
              onShareProject={onShareProject}
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
