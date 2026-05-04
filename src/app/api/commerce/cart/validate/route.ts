import { NextResponse } from "next/server";

import { validateCommerceCart } from "@/lib/commerce/cart/validation";
import type { CommerceLineInput } from "@/lib/commerce/types";

interface ValidateCartRequestBody {
  items?: CommerceLineInput[];
}

export async function POST(request: Request) {
  let body: ValidateCartRequestBody;

  try {
    body = (await request.json()) as ValidateCartRequestBody;
  } catch {
    return NextResponse.json({ error: "CART_PAYLOAD_INVALID" }, { status: 400 });
  }

  try {
    const validation = validateCommerceCart(body.items || []);
    return NextResponse.json(validation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "CART_INVALID";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
