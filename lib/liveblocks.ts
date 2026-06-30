import { Liveblocks } from "@liveblocks/node";

const globalForLiveblocks = globalThis as typeof globalThis & {
  liveblocks?: Liveblocks;
};

export function getLiveblocksClient(): Liveblocks {
  if (globalForLiveblocks.liveblocks) {
    return globalForLiveblocks.liveblocks;
  }

  const secretKey = process.env.LIVEBLOCKS_SECRET_KEY;

  if (!secretKey) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is required.");
  }

  const client = new Liveblocks({ secret: secretKey });

  if (process.env.NODE_ENV !== "production") {
    globalForLiveblocks.liveblocks = client;
  }

  return client;
}

export default getLiveblocksClient;
