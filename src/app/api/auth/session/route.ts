import { NextResponse } from "next/server";

import {
  SESSION_NAME_COOKIE,
  SESSION_ROLE_COOKIE,
  parseCollaboratorRole,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const role = parseCollaboratorRole(formData.get("role")?.toString());
  const displayName = formData.get("name")?.toString().trim() || role || "Collaborateur";
  const redirectTo = formData.get("redirectTo")?.toString() || "/collaborateurs";

  if (!role) {
    return NextResponse.redirect(new URL("/collaborateurs", request.url));
  }

  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  response.cookies.set(SESSION_ROLE_COOKIE, role, sessionCookieOptions);
  response.cookies.set(SESSION_NAME_COOKIE, displayName, sessionCookieOptions);

  return response;
}
