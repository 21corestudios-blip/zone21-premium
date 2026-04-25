import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

import {
  collaboratorRoles,
  roleDetails,
  type CollaboratorRole,
} from "./permissions";

export const SESSION_ROLE_COOKIE = "z21_collab_role";
export const SESSION_NAME_COOKIE = "z21_collab_name";

export interface CollaboratorSession {
  role: CollaboratorRole;
  displayName: string;
  roleLabel: string;
  summary: string;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8,
};

export function parseCollaboratorRole(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return collaboratorRoles.includes(value as CollaboratorRole)
    ? (value as CollaboratorRole)
    : null;
}

function buildSession(
  role: CollaboratorRole,
  displayName?: string | null,
): CollaboratorSession {
  const roleMeta = roleDetails[role];

  return {
    role,
    displayName: displayName?.trim() || roleMeta.label,
    roleLabel: roleMeta.label,
    summary: roleMeta.summary,
  };
}

export async function getSession() {
  const cookieStore = await cookies();
  const role = parseCollaboratorRole(
    cookieStore.get(SESSION_ROLE_COOKIE)?.value,
  );

  if (!role) {
    return null;
  }

  return buildSession(role, cookieStore.get(SESSION_NAME_COOKIE)?.value);
}

export function getRequestSession(request: NextRequest) {
  const role = parseCollaboratorRole(
    request.cookies.get(SESSION_ROLE_COOKIE)?.value ??
      request.headers.get("x-zone21-role"),
  );

  if (!role) {
    return null;
  }

  return buildSession(
    role,
    request.cookies.get(SESSION_NAME_COOKIE)?.value ??
      request.headers.get("x-zone21-name"),
  );
}

// Prototype only:
// this role cookie is useful to structure the collaborators UI and RBAC flows,
// but it is not production-grade authentication. A real implementation must
// replace it with server-validated identity, signed sessions, and role claims
// issued by a trusted auth provider without breaking the current API shape.
