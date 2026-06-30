import prisma from "@/lib/prisma";
import {
  enrichCollaborators,
  enrichProjectOwner,
  getCollaboratorAccess,
  parseCollaboratorEmail,
  readJsonObject,
} from "@/lib/api/collaborators";
import { getCurrentClerkIdentity } from "@/lib/project-access";

interface CollaboratorsRouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(
  _request: Request,
  context: CollaboratorsRouteContext
): Promise<Response> {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await context.params;
  const access = await getCollaboratorAccess(projectId, identity);

  if (!access) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const collaborators = await prisma.projectCollaborator.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  const [owner, enrichedCollaborators] = await Promise.all([
    enrichProjectOwner(access.project.ownerId),
    enrichCollaborators(collaborators),
  ]);

  return Response.json({
    owner,
    collaborators: enrichedCollaborators,
    canManageAccess: access.canManageAccess,
  });
}

export async function POST(
  request: Request,
  context: CollaboratorsRouteContext
): Promise<Response> {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await context.params;
  const access = await getCollaboratorAccess(projectId, identity);

  if (!access?.canManageAccess) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await readJsonObject(request);

  if (body instanceof Response) {
    return body;
  }

  const email = parseCollaboratorEmail(body);

  if (email instanceof Response) {
    return email;
  }

  const collaborator = await prisma.projectCollaborator.upsert({
    where: {
      projectId_email: {
        projectId,
        email,
      },
    },
    create: {
      projectId,
      email,
    },
    update: {},
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  const [enrichedCollaborator] = await enrichCollaborators([collaborator]);

  return Response.json(
    { collaborator: enrichedCollaborator, canManageAccess: true },
    { status: 201 }
  );
}
