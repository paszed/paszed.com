import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const sessionId = randomUUID();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
const statuses = [];
const ids = [];

const responses = await Promise.all(
  Array.from({ length: 121 }, async (_, i) => {
    const id = randomUUID();
    ids[i] = id;
    const response = await fetch("http://localhost:3000/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        sessionId,
        source: "browser",
        type: "heartbeat",
        path: "/en",
        timestamp: new Date().toISOString(),
      }),
    });
    if (response.status !== 200 && response.status !== 429) {
      console.error("Unexpected response", i + 1, response.status, await response.text());
      process.exitCode = 1;
    }
    return { id, status: response.status };
  }),
);
statuses.push(...responses.map((response) => response.status));

const { data, error } = await supabase
  .from("analytics_events")
  .select("id")
  .eq("session_id", sessionId);
if (error) throw error;

const accepted = statuses.filter((status) => status === 200).length;
const rejected = statuses.filter((status) => status === 429).length;
const persisted = data.length;
const rejectedIds = new Set(
  responses.filter((response) => response.status === 429).map((response) => response.id),
);
const rejectedPersisted = data.some((event) => rejectedIds.has(event.id));
const passed = accepted === 120 && rejected === 1 && persisted === 120 && !rejectedPersisted;

console.log(JSON.stringify({
  sessionId, accepted, rejected, persisted, rejectedPersisted, passed,
}, null, 2));
if (!passed) process.exitCode = 1;
