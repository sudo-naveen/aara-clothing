import { auth } from "@/auth";
import { errorResponse } from "@/lib/api-response";
import type { NextResponse } from "next/server";

export async function requireAuth(): Promise<
  { userId: string; username: string } | { error: NextResponse }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: errorResponse("Unauthorized", 401) };
  }

  return { userId: session.user.id, username: session.user.username };
}
