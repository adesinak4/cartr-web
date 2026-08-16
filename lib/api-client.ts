import { env } from "./env";

interface ApiEnvelopeSuccess<T> {
  status: "success";
  data: T;
}

interface ApiEnvelopeError {
  status: "error";
  message: string;
  code: string;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiRequestOptions {
  method?: string;
  body?: unknown;
  accessToken?: string;
}

/**
 * Low-level, server-only call to cartr-api — never called from client
 * components directly (the browser only ever talks to this Next.js app's
 * own Route Handlers). Parses the backend's {status,data}/{status,message,code}
 * envelope and normalizes both HTTP-level and envelope-level failures into
 * one ApiError, keyed on the backend's domain error code so callers can
 * react to specific failures (e.g. THEME_NOT_ALLOWED) rather than strings.
 */
export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${env.CARTR_API_URL}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.accessToken
          ? { Authorization: `Bearer ${options.accessToken}` }
          : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new ApiError(502, "UPSTREAM_UNREACHABLE", "Unable to reach the server");
  }

  const json = (await response.json().catch(() => null)) as
    | ApiEnvelopeSuccess<T>
    | ApiEnvelopeError
    | null;

  if (!response.ok || !json || json.status === "error") {
    const code = json && "code" in json ? json.code : "UNKNOWN_ERROR";
    const message =
      json && "message" in json
        ? json.message
        : `Request failed (${response.status})`;
    throw new ApiError(response.status, code, message);
  }

  return json.data;
}
