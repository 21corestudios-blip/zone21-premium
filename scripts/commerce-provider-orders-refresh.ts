import { refreshProviderOrderStatuses } from "@/lib/commerce/ops/provider-order-status";
import type { ProviderOrderRecord } from "@/lib/commerce/persistence/types";
import { loadCommerceScriptEnv } from "./lib/load-commerce-env";

loadCommerceScriptEnv();

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value] as const;
  }),
);

const provider = args.get("provider") as ProviderOrderRecord["provider"] | undefined;
const status = args.get("status") as ProviderOrderRecord["status"] | undefined;
const limit = Number.parseInt(args.get("limit") || "20", 10);

async function main() {
  const results = await refreshProviderOrderStatuses({ provider, status, limit });

  console.log(
    JSON.stringify(
      {
        status: "complete",
        count: results.length,
        results,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
