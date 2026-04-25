import { NextResponse } from "next/server";

import { SESSION_NAME_COOKIE, SESSION_ROLE_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const redirectTo = formData.get("redirectTo")?.toString() || "/collaborateurs";
  const response = NextResponse.redirect(new URL(redirectTo, request.url));

  response.cookies.set(SESSION_ROLE_COOKIE, "", {
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set(SESSION_NAME_COOKIE, "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
