export type FetchJsonResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function fetchJsonResult<T>(input: RequestInfo | URL, init?: RequestInit): Promise<FetchJsonResult<T>> {
  try {
    const response = await fetch(input, init);
    const bodyText = await response.text();
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      return { ok: false, error: bodyText || `Request failed with status ${response.status}` };
    }

    if (!contentType.includes("application/json")) {
      return { ok: false, error: bodyText || "Expected a JSON response" };
    }

    try {
      return { ok: true, data: JSON.parse(bodyText) as T };
    } catch {
      return { ok: false, error: `Invalid JSON response from ${typeof input === "string" ? input : "request"}` };
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network request failed",
    };
  }
}