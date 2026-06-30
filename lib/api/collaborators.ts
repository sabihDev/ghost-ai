import { clerkClient } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { type ClerkIdentity } from "@/lib/project-access";

interface JsonObject {
  [key: string]: unknown;
}

interface CollaboratorRecord {
  id: string;
  email: string;
  createdAt: Date;
}

export interface EnrichedCollaborator {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface EnrichedProjectOwner {
  id: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
}

export interface CollaboratorAccess {
  project: {
    id: string;
    ownerId: string;
  };
  canManageAccess: boolean;
}

export async function readJsonObject(
  request: Request
): Promise<JsonObject | Response> {
  try {
    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ error: "Request body must be an object." }, {
        status: 400,
      });
    }

    return body as JsonObject;
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, {
      status: 400,
    });
  }
}

export function parseCollaboratorEmail(body: JsonObject): string | Response {
  const email = body.email;

  if (typeof email !== "string") {
    return Response.json({ error: "Collaborator email is required." }, {
      status: 400,
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (
    !normalizedEmail ||
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return Response.json({ error: "Collaborator email is invalid." }, {
      status: 400,
    });
  }

  return normalizedEmail;
}

export async function getCollaboratorAccess(
  projectId: string,
  identity: ClerkIdentity
): Promise<CollaboratorAccess | null> {
  const primaryEmail = identity.primaryEmail?.toLowerCase() ?? "";
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      ownerId: true,
      collaborators: {
        where: {
          email: primaryEmail,
        },
        select: {
          id: true,
        },
        take: 1,
      },
    },
  });

  if (!project) {
    return null;
  }

  const canManageAccess = project.ownerId === identity.userId;
  const hasAccess = canManageAccess || project.collaborators.length > 0;

  if (!hasAccess) {
    return null;
  }

  return {
    project: {
      id: project.id,
      ownerId: project.ownerId,
    },
    canManageAccess,
  };
}

export async function enrichCollaborators(
  collaborators: CollaboratorRecord[]
): Promise<EnrichedCollaborator[]> {
  const emailToProfile = new Map<
    string,
    {
      displayName: string | null;
      avatarUrl: string | null;
    }
  >();

  if (collaborators.length > 0) {
    try {
      const client = await clerkClient();
      const users = await client.users.getUserList({
        emailAddress: collaborators.map((collaborator) => collaborator.email),
        limit: collaborators.length,
      });

      for (const user of users.data) {
        for (const emailAddress of user.emailAddresses) {
          const email = emailAddress.emailAddress.toLowerCase();
          emailToProfile.set(email, {
            displayName: user.fullName,
            avatarUrl: user.imageUrl || null,
          });
        }
      }
    } catch {
      // Clerk enrichment is best-effort; access data still comes from Prisma.
    }
  }

  return collaborators.map((collaborator) => {
    const profile = emailToProfile.get(collaborator.email.toLowerCase());

    return {
      id: collaborator.id,
      email: collaborator.email,
      displayName: profile?.displayName ?? null,
      avatarUrl: profile?.avatarUrl ?? null,
      createdAt: collaborator.createdAt.toISOString(),
    };
  });
}

export async function enrichProjectOwner(
  ownerId: string
): Promise<EnrichedProjectOwner> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(ownerId);
    const primaryEmail =
      user.emailAddresses.find(
        (emailAddress) => emailAddress.id === user.primaryEmailAddressId
      )?.emailAddress ??
      user.emailAddresses[0]?.emailAddress ??
      null;

    return {
      id: ownerId,
      email: primaryEmail?.toLowerCase() ?? null,
      displayName: user.fullName,
      avatarUrl: user.imageUrl || null,
    };
  } catch {
    return {
      id: ownerId,
      email: null,
      displayName: null,
      avatarUrl: null,
    };
  }
}
