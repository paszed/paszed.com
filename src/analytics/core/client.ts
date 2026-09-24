import { createEventPayload } from "./transport";
import type { TrackEventInput } from "../events";

export async function track(event: TrackEventInput): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createEventPayload(event)),
      keepalive: true,
    });

    if (!response.ok) {
      console.error("[analytics:delivery]", response.status);
    }
  } catch (error) {
    console.error("[analytics:delivery]", error);
  }
}
