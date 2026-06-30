import type { Prisma } from "@/app/generated/prisma/client";

import prisma from "@/lib/prisma";
import {
  getAuthenticatedUser,
  parseOptionalProjectId,
  parseOptionalProjectName,
  readJsonObject,
} from "@/lib/api/projects";
import { getCurrentClerkIdentity } from "@/lib/project-access";

export async function GET(): Promise<Response> {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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
      ownerId: { not: identity.userId },
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
    }),
    prisma.project.findMany({
      where: {
        OR: sharedProjectFilters,
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
  ]);

  return Response.json({ ownedProjects, sharedProjects });
}

export async function POST(request: Request): Promise<Response> {
  const user = await getAuthenticatedUser();

  if (user instanceof Response) {
    return user;
  }

  const body = await readJsonObject(request);

  if (body instanceof Response) {
    return body;
  }

  const projectId = parseOptionalProjectId(body);

  if (projectId instanceof Response) {
    return projectId;
  }

  const project = await prisma.project.create({
    data: {
      id: projectId || undefined,
      name: parseOptionalProjectName(body),
      ownerId: user.userId,
    },
  });

  return Response.json({ project }, { status: 201 });
}
