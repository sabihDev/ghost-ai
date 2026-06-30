"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  Bot,
  PanelLeftClose,
  PanelLeftOpen,
  Share2,
} from "lucide-react";

import { Canvas } from "@/components/editor/canvas";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ShapePanel } from "@/components/editor/shape-panel";
import { ShareDialog } from "@/components/editor/share-dialog";
import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/use-project-actions";
import { type EditorProjectLists } from "@/lib/projects";

interface EditorWorkspaceShellProps extends EditorProjectLists {
  project: {
    id: string;
    name: string;
  };
}

export function EditorWorkspaceShell({
  ownedProjects,
  project,
  sharedProjects,
}: EditorWorkspaceShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);
  const [shareProject, setShareProject] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const projectActions = useProjectActions();
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <header className="flex h-14 shrink-0 items-center border-b border-surface-border bg-surface px-4">
        <div className="flex flex-1 items-center justify-start gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              isSidebarOpen ? "Close project sidebar" : "Open project sidebar"
            }
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen((current) => !current)}
          >
            <SidebarIcon className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-sm font-semibold tracking-normal text-copy-primary">
            {project.name}
          </h1>
          <p className="truncate font-mono text-xs text-copy-muted">
            {project.id}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            aria-label="Share project"
            onClick={() => setShareProject(project)}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"
            }
            aria-expanded={isAiSidebarOpen}
            onClick={() => setIsAiSidebarOpen((current) => !current)}
          >
            <Bot className="h-5 w-5" aria-hidden="true" />
          </Button>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
              },
            }}
          />
        </div>
      </header>

      <main className="relative min-h-0 flex-1 overflow-hidden bg-base">
        <ProjectSidebar
          activeProjectId={project.id}
          isOpen={isSidebarOpen}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={projectActions.openCreateDialog}
          onDeleteProject={projectActions.openDeleteDialog}
          onRenameProject={projectActions.openRenameDialog}
          onShareProject={(sidebarProject) => setShareProject(sidebarProject)}
        />

        <section className="flex h-full min-h-0">
          <div className="relative min-w-0 flex-1 overflow-hidden bg-base">
            <Canvas roomId={project.id} />
          </div>

          {isAiSidebarOpen ? (
            <aside className="hidden w-80 shrink-0 border-l border-surface-border bg-surface p-4 lg:flex lg:flex-col">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-ai-text" aria-hidden="true" />
                <h2 className="text-sm font-semibold tracking-normal">
                  AI Assistant
                </h2>
              </div>
              <div className="mt-4 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-surface-border-subtle bg-subtle/50 px-6 text-center">
                <p className="text-sm leading-6 text-copy-muted">
                  AI chat controls will appear here.
                </p>
              </div>
            </aside>
          ) : null}
        </section>

        <ShapePanel />
      </main>

      <ProjectDialogs
        activeProject={projectActions.activeProject}
        dialogMode={projectActions.dialogMode}
        isLoading={projectActions.isLoading}
        projectName={projectActions.projectName}
        roomIdPreview={projectActions.roomIdPreview}
        onClose={projectActions.closeDialog}
        onCreateSubmit={projectActions.submitCreateProject}
        onDeleteConfirm={projectActions.submitDeleteProject}
        onProjectNameChange={projectActions.setProjectName}
        onRenameSubmit={projectActions.submitRenameProject}
      />

      {shareProject ? (
        <ShareDialog
          isOpen={true}
          projectId={shareProject.id}
          projectName={shareProject.name}
          onOpenChange={(open) => {
            if (!open) {
              setShareProject(null);
            }
          }}
        />
      ) : null}
    </div>
  );
}
