import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import { resolvePreviewPath } from "@/lib/storyblok/preview";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL(resolvePreviewPath(slug), request.url));
}
