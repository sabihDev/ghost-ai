"use client";

import { type FormEvent, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { type EditorProject } from "@/lib/projects";

type ProjectDialogMode = "create" | "rename" | "delete";

interface ProjectResponse {
  project?: {
    id?: unknown;
  };
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

function createShortSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

async function readProjectId(response: Response) {
  const body: ProjectResponse = await response.json();
  const projectId = body.project?.id;

  if (typeof projectId !== "string") {
    throw new Error("Project response did not include an ID.");
  }

  return projectId;
}

export function useProjectActions() {
  const router = useRouter();
  const pathname = usePathname();
  const [dialogMode, setDialogMode] = useState<ProjectDialogMode | null>(null);
  const [activeProject, setActiveProject] = useState<EditorProject | null>(
    null,
  );
  const [projectName, setProjectName] = useState("");
  const [createSuffix, setCreateSuffix] = useState(createShortSuffix);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const roomIdPreview = useMemo(
    () => `${slugify(projectName)}-${createSuffix}`,
    [createSuffix, projectName],
  );

  function closeDialog() {
    setDialogMode(null);
    setActiveProject(null);
    setProjectName("");
    setIsLoading(false);
    setError(null);
  }

  function clearError() {
    setError(null);
  }

  function openCreateDialog() {
    setActiveProject(null);
    setProjectName("");
    setCreateSuffix(createShortSuffix());
    setDialogMode("create");
  }

  function openRenameDialog(project: EditorProject) {
    setActiveProject(project);
    setProjectName(project.name);
    setDialogMode("rename");
  }

  function openDeleteDialog(project: EditorProject) {
    setActiveProject(project);
    setProjectName(project.name);
    setDialogMode("delete");
  }

  async function submitCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = projectName.trim();

    if (!name) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: roomIdPreview,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error("Project creation failed.");
      }

      const projectId = await readProjectId(response);
      closeDialog();
      router.push(`/editor/${projectId}`);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setIsLoading(false);
    }
  }

  async function submitRenameProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = projectName.trim();

    if (!activeProject || !name) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Project rename failed.");
      }

      closeDialog();
      router.refresh();
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setIsLoading(false);
    }
  }

  async function submitDeleteProject() {
    if (!activeProject) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Project delete failed.");
      }

      const isDeletingActiveWorkspace =
        pathname === `/editor/${activeProject.id}`;

      closeDialog();

      if (isDeletingActiveWorkspace) {
        router.replace("/editor");
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setIsLoading(false);
    }
  }

  return {
    activeProject,
    clearError,
    closeDialog,
    dialogMode,
    error,
    isLoading,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    projectName,
    roomIdPreview,
    setProjectName,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  };
}
