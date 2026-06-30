"use client";

import { useState } from "react";

import { EditorHome } from "@/components/editor/editor-home";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ShareDialog } from "@/components/editor/share-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import { type EditorProject, type EditorProjectLists } from "@/lib/projects";

interface EditorShellProps extends EditorProjectLists {
  activeProjectId?: string;
}

export function EditorShell({
  activeProjectId,
  ownedProjects,
  sharedProjects,
}: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [shareProject, setShareProject] = useState<EditorProject | null>(null);
  const projectActions = useProjectActions();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />
      <main className="relative min-h-0 flex-1 bg-base">
        <ProjectSidebar
          activeProjectId={activeProjectId}
          isOpen={isSidebarOpen}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={projectActions.openCreateDialog}
          onDeleteProject={projectActions.openDeleteDialog}
          onRenameProject={projectActions.openRenameDialog}
          onShareProject={(project) => setShareProject(project)}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        <EditorHome onCreateProject={projectActions.openCreateDialog} />
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
