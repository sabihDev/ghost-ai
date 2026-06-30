import { auth, currentUser } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export interface ClerkIdentity {
  userId: string;
  primaryEmail: string | null;
  emails: string[];
}

export interface AccessibleProject {
  id: string;
  name: string;
  ownerId: string;
}

export async function getCurrentClerkIdentity(): Promise<ClerkIdentity | null> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return null;
  }

  const user = await currentUser();
  const emails =
    user?.emailAddresses
      .map((emailAddress) => emailAddress.emailAddress.toLowerCase())
      .filter((emailAddress) => emailAddress.length > 0) ?? [];
  const primaryEmail =
    user?.emailAddresses
      .find((emailAddress) => emailAddress.id === user.primaryEmailAddressId)
      ?.emailAddress.toLowerCase() ??
    emails[0] ??
    null;

  return {
    userId,
    primaryEmail,
    emails,
  };
}

export async function getAccessibleProject(
  projectId: string,
  identity: ClerkIdentity
): Promise<AccessibleProject | null> {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      id: true,
      name: true,
      ownerId: true,
      collaborators: {
        where: {
          email: {
            in: identity.emails,
          },
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

  const hasAccess =
    project.ownerId === identity.userId || project.collaborators.length > 0;

  if (!hasAccess) {
    return null;
  }

  return {
    id: project.id,
    name: project.name,
    ownerId: project.ownerId,
  };
}
