import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

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

interface EmailClaims {
  email?: unknown;
  primary_email_address?: unknown;
}

function getClaimEmail(sessionClaims: unknown): string | null {
  if (!sessionClaims || typeof sessionClaims !== "object") {
    return null;
  }

  const claims = sessionClaims as EmailClaims;

  if (typeof claims.email === "string") {
    return claims.email;
  }

  if (typeof claims.primary_email_address === "string") {
    return claims.primary_email_address;
  }

  return null;
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
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return {
      ownedProjects: [],
      sharedProjects: [],
    };
  }

  const sharedEmail = getClaimEmail(sessionClaims);

  const [ownedProjects, sharedProjects] = await Promise.all([
    prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    }),
    sharedEmail
      ? prisma.project.findMany({
          where: {
            ownerId: {
              not: userId,
            },
            collaborators: {
              some: {
                email: sharedEmail,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            id: true,
            name: true,
            updatedAt: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return {
    ownedProjects: ownedProjects.map((project) =>
      toEditorProject(project, "owned")
    ),
    sharedProjects: sharedProjects.map((project) =>
      toEditorProject(project, "shared")
    ),
  };
}
