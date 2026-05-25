"use client";

import { type FormEvent, useMemo, useState } from "react";

export type ProjectAccess = "owned" | "shared";

export interface MockProject {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
  access: ProjectAccess;
}

type ProjectDialogMode = "create" | "rename" | "delete";

const INITIAL_PROJECTS: MockProject[] = [
  {
    id: "retail-platform",
    name: "Retail Platform",
    slug: "retail-platform",
    updatedAt: "Updated today",
    access: "owned",
  },
  {
    id: "payments-modernization",
    name: "Payments Modernization",
    slug: "payments-modernization",
    updatedAt: "Updated yesterday",
    access: "owned",
  },
  {
    id: "analytics-mesh",
    name: "Analytics Mesh",
    slug: "analytics-mesh",
    updatedAt: "Shared by Maya",
    access: "shared",
  },
];

function createSlug(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<MockProject[]>(INITIAL_PROJECTS);
  const [dialogMode, setDialogMode] = useState<ProjectDialogMode | null>(null);
  const [activeProject, setActiveProject] = useState<MockProject | null>(null);
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const slugPreview = useMemo(() => createSlug(projectName), [projectName]);

  function closeDialog() {
    setDialogMode(null);
    setActiveProject(null);
    setProjectName("");
    setIsLoading(false);
  }

  function openCreateDialog() {
    setActiveProject(null);
    setProjectName("");
    setDialogMode("create");
  }

  function openRenameDialog(project: MockProject) {
    setActiveProject(project);
    setProjectName(project.name);
    setDialogMode("rename");
  }

  function openDeleteDialog(project: MockProject) {
    setActiveProject(project);
    setProjectName(project.name);
    setDialogMode("delete");
  }

  function submitCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    setIsLoading(true);
    setProjects((currentProjects) => [
      {
        id: `${slugPreview}-${currentProjects.length + 1}`,
        name: projectName.trim(),
        slug: slugPreview,
        updatedAt: "Updated just now",
        access: "owned",
      },
      ...currentProjects,
    ]);
    closeDialog();
  }

  function submitRenameProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeProject || !projectName.trim()) {
      return;
    }

    setIsLoading(true);
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === activeProject.id
          ? {
              ...project,
              name: projectName.trim(),
              slug: createSlug(projectName),
              updatedAt: "Updated just now",
            }
          : project
      )
    );
    closeDialog();
  }

  function submitDeleteProject() {
    if (!activeProject) {
      return;
    }

    setIsLoading(true);
    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== activeProject.id)
    );
    closeDialog();
  }

  return {
    activeProject,
    dialogMode,
    isLoading,
    projectName,
    projects,
    slugPreview,
    closeDialog,
    openCreateDialog,
    openDeleteDialog,
    openRenameDialog,
    setProjectName,
    submitCreateProject,
    submitDeleteProject,
    submitRenameProject,
  };
}
