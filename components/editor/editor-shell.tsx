"use client";

import { useState } from "react";

import { EditorHome } from "@/components/editor/editor-home";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { useProjectDialogs } from "@/components/editor/use-project-dialogs";

export function EditorShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const projectDialogs = useProjectDialogs();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-base text-copy-primary">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />
      <main className="relative min-h-0 flex-1 bg-base">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          projects={projectDialogs.projects}
          onClose={() => setIsSidebarOpen(false)}
          onCreateProject={projectDialogs.openCreateDialog}
          onDeleteProject={projectDialogs.openDeleteDialog}
          onRenameProject={projectDialogs.openRenameDialog}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-default)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-default)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
        <EditorHome onCreateProject={projectDialogs.openCreateDialog} />
      </main>
      <ProjectDialogs
        activeProject={projectDialogs.activeProject}
        dialogMode={projectDialogs.dialogMode}
        isLoading={projectDialogs.isLoading}
        projectName={projectDialogs.projectName}
        slugPreview={projectDialogs.slugPreview}
        onClose={projectDialogs.closeDialog}
        onCreateSubmit={projectDialogs.submitCreateProject}
        onDeleteConfirm={projectDialogs.submitDeleteProject}
        onProjectNameChange={projectDialogs.setProjectName}
        onRenameSubmit={projectDialogs.submitRenameProject}
      />
    </div>
  );
}
