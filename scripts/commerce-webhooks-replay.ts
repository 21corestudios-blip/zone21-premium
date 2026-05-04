import {
  listPersistedWebhooks,
  replayPersistedWebhook,
} from "@/lib/commerce/ops/webhook-replay";
import type {
  StoredWebhookEvent,
  WebhookProcessingStatus,
} from "@/lib/commerce/persistence/types";

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value] as const;
  }),
);

const eventId = args.get("event");
const provider = (args.get("provider") || "stripe") as StoredWebhookEvent["provider"];
const status = args.get("status") as WebhookProcessingStatus | undefined;
const limit = Number.parseInt(args.get("limit") || "20", 10);
const force = args.get("force") === "true";

async function main() {
  if (!eventId) {
    const events = await listPersistedWebhooks({ provider, status, limit });
    console.log(
      JSON.stringify(
        {
          mode: "list",
          provider,
          status: status || "any",
          count: events.length,
          events: events.map((event) => ({
            eventId: event.eventId,
            eventType: event.eventType,
            status: event.processingStatus,
            receivedAt: event.receivedAt,
            processedAt: event.processedAt,
            errorMessage: event.errorMessage,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  const result = await replayPersistedWebhook({ provider, eventId, force });
  console.log(JSON.stringify({ mode: "replay", result }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
