export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const bodyText = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    throw new Error(bodyText || `Request failed with status ${response.status}`);
  }

  if (!contentType.includes("application/json")) {
    throw new Error(bodyText || "Expected a JSON response");
  }

  try {
    return JSON.parse(bodyText) as T;
  } catch {
    throw new Error(`Invalid JSON response from ${typeof input === "string" ? input : "request"}`);
  }
}