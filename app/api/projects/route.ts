import prisma from "@/lib/prisma";
import {
  getAuthenticatedUser,
  parseOptionalProjectId,
  parseOptionalProjectName,
  readJsonObject,
} from "@/lib/api/projects";

export async function GET(): Promise<Response> {
  const user = await getAuthenticatedUser();

  if (user instanceof Response) {
    return user;
  }

  const projects = await prisma.project.findMany({
    where: {
      ownerId: user.userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return Response.json({ projects });
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
