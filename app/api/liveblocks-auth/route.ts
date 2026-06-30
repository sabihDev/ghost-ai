import { currentUser } from "@clerk/nextjs/server";

import { getLiveblocksClient } from "@/lib/liveblocks";
import { cursorColorFor } from "@/lib/cursor-colors";
import { getAccessibleProject, getCurrentClerkIdentity } from "@/lib/project-access";

export async function POST(request: Request): Promise<Response> {
  let body: { room?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const roomId = body.room;

  if (typeof roomId !== "string" || !roomId) {
    return Response.json({ error: "Room ID is required." }, { status: 400 });
  }

  const identity = await getCurrentClerkIdentity();

  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await getAccessibleProject(roomId, identity);

  if (!project) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const clerkUser = await currentUser();

  const displayName = clerkUser?.fullName
    ?? clerkUser?.username
    ?? clerkUser?.emailAddresses[0]?.emailAddress
    ?? identity.userId;

  const avatar = clerkUser?.imageUrl ?? "";

  const cursorColor = cursorColorFor(identity.userId);

  const liveblocks = getLiveblocksClient();
  await liveblocks.getOrCreateRoom(roomId, {
    defaultAccesses: [],
    usersAccesses: {
      [identity.userId]: ["room:write"],
    },
  });

  const { status, body: liveblocksBody } = await liveblocks.identifyUser(
    {
      userId: identity.userId,
      groupIds: [],
    },
    {
      userInfo: {
        name: displayName,
        avatar,
        cursorColor,
      },
    },
  );

  return new Response(liveblocksBody, { status });
}
