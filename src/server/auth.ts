import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function requireSession() {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
      { status: 401 }
    );
  }
  return null;
}
