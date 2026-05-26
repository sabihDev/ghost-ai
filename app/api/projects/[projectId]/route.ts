import prisma from "@/lib/prisma";
import {
  getAuthenticatedUser,
  parseRequiredProjectName,
  readJsonObject,
} from "@/lib/api/projects";

interface ProjectRouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function PATCH(
  request: Request,
  context: ProjectRouteContext
): Promise<Response> {
  const user = await getAuthenticatedUser();

  if (user instanceof Response) {
    return user;
  }

  const { projectId } = await context.params;
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      ownerId: true,
    },
  });

  if (!project || project.ownerId !== user.userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await readJsonObject(request);

  if (body instanceof Response) {
    return body;
  }

  const name = parseRequiredProjectName(body);

  if (name instanceof Response) {
    return name;
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name,
    },
  });

  return Response.json({ project: updatedProject });
}

export async function DELETE(
  _request: Request,
  context: ProjectRouteContext
): Promise<Response> {
  const user = await getAuthenticatedUser();

  if (user instanceof Response) {
    return user;
  }

  const { projectId } = await context.params;
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      ownerId: true,
    },
  });

  if (!project || project.ownerId !== user.userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return Response.json({ success: true });
}
