import { API_BASE_URL } from "./config";

type ApiErrorPayload = {
  message: string;
  code?: string;
  details?: unknown;
};

export type ApiFetchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiErrorPayload };

export class ApiFetchError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  apiKey?: string | null;
};

const getApiKey = (overrideKey?: string | null) => {
  if (overrideKey) {
    return overrideKey;
  }
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("apiKey");
};

export const apiFetch = async <T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<ApiFetchResult<T>> => {
  const apiKey = getApiKey(options.apiKey);
  const headers = new Headers(options.headers);

  if (apiKey) {
    headers.set("x-api-key", apiKey);
  }

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && options.body !== undefined) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: isFormData || options.body === undefined ? (options.body as BodyInit | null | undefined) : JSON.stringify(options.body),
  });

  const payload = (await response.json()) as ApiFetchResult<T>;

  if (!response.ok || !payload.ok) {
    const errorPayload = payload.ok
      ? { message: response.statusText, code: "HTTP_ERROR" }
      : payload.error;
    throw new ApiFetchError(
      errorPayload.message,
      response.status,
      errorPayload.code,
      errorPayload.details,
    );
  }

  return payload;
};
