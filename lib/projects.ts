import type { Prisma } from "@/app/generated/prisma/client";

import prisma from "@/lib/prisma";
import { getCurrentClerkIdentity } from "@/lib/project-access";

export type ProjectAccess = "owned" | "shared";

export interface EditorProject {
  id: string;
  name: string;
  roomId: string;
  updatedAt: string;
  access: ProjectAccess;
}

export interface EditorProjectLists {
  ownedProjects: EditorProject[];
  sharedProjects: EditorProject[];
}

interface ProjectListRecord {
  id: string;
  name: string;
  ownerId: string;
  updatedAt: Date;
}

function formatUpdatedAt(updatedAt: Date): string {
  return `Updated ${new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(updatedAt)}`;
}

function toEditorProject(
  project: { id: string; name: string; updatedAt: Date },
  access: ProjectAccess
): EditorProject {
  return {
    id: project.id,
    name: project.name,
    roomId: project.id,
    updatedAt: formatUpdatedAt(project.updatedAt),
    access,
  };
}

export async function getEditorProjectLists(): Promise<EditorProjectLists> {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return {
      ownedProjects: [],
      sharedProjects: [],
    };
  }

  const sharedEmails = identity.emails;
  const sharedProjectFilters: Prisma.ProjectWhereInput[] = [
    {
      ownerId: identity.userId,
      collaborators: {
        some: {},
      },
    },
  ];

  if (sharedEmails.length > 0) {
    sharedProjectFilters.push({
      ownerId: {
        not: identity.userId,
      },
      collaborators: {
        some: {
          email: {
            in: sharedEmails,
          },
        },
      },
    });
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: {
        ownerId: identity.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        updatedAt: true,
      },
    }),
    prisma.project.findMany({
      where: {
        OR: sharedProjectFilters,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    ownedProjects: ownedProjects.map((project) =>
      toEditorProject(project, "owned")
    ),
    sharedProjects: sharedProjects.map((project: ProjectListRecord) =>
      toEditorProject(
        project,
        project.ownerId === identity.userId ? "owned" : "shared"
      )
    ),
  };
}
