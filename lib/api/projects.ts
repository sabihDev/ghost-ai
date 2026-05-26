import { auth } from "@clerk/nextjs/server";

interface AuthenticatedUser {
  userId: string;
}

interface JsonObject {
  [key: string]: unknown;
}

export const DEFAULT_PROJECT_NAME = "Untitled Project";

export async function getAuthenticatedUser(): Promise<
  AuthenticatedUser | Response
> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { userId };
}

export async function readJsonObject(request: Request): Promise<
  JsonObject | Response
> {
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

export function parseOptionalProjectName(body: JsonObject): string {
  const name = body.name;

  if (typeof name !== "string") {
    return DEFAULT_PROJECT_NAME;
  }

  const trimmedName = name.trim();

  return trimmedName || DEFAULT_PROJECT_NAME;
}

export function parseOptionalProjectId(body: JsonObject): string | Response {
  const id = body.id;

  if (typeof id === "undefined") {
    return "";
  }

  if (
    typeof id !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ||
    id.length > 96
  ) {
    return Response.json({ error: "Project ID must be a valid room ID." }, {
      status: 400,
    });
  }

  return id;
}

export function parseRequiredProjectName(
  body: JsonObject
): string | Response {
  const name = body.name;

  if (typeof name !== "string" || !name.trim()) {
    return Response.json({ error: "Project name is required." }, {
      status: 400,
    });
  }

  return name.trim();
}
