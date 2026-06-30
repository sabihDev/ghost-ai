import prisma from "@/lib/prisma";
import { getCollaboratorAccess } from "@/lib/api/collaborators";
import { getCurrentClerkIdentity } from "@/lib/project-access";

interface CollaboratorRouteContext {
  params: Promise<{
    projectId: string;
    collaboratorId: string;
  }>;
}

export async function DELETE(
  _request: Request,
  context: CollaboratorRouteContext
): Promise<Response> {
  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { collaboratorId, projectId } = await context.params;
  const access = await getCollaboratorAccess(projectId, identity);

  if (!access?.canManageAccess) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.projectCollaborator.deleteMany({
    where: {
      id: collaboratorId,
      projectId,
    },
  });

  return Response.json({ success: true });
}
