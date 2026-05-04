import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import {
  isValidPreviewSecret,
  resolvePreviewPath,
} from "@/lib/storyblok/preview";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const slug = url.searchParams.get("slug");

  if (!isValidPreviewSecret(secret)) {
    return NextResponse.json({ message: "Invalid preview secret" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(resolvePreviewPath(slug), request.url));
}
