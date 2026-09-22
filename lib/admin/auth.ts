export const ADMIN_COOKIE = "admin_token";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Cookie value is a HMAC of the secret — never store the raw ADMIN_SECRET. */
export async function deriveAdminSessionToken(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode("bd-studio-admin-session-v1")
  );
  return toHex(signature);
}

/** Constant-time string compare (mitigates timing attacks). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function isValidAdminSecret(input: string, secret: string): boolean {
  return safeEqual(input, secret);
}

export async function isValidAdminSession(
  cookieValue: string | undefined,
  secret: string
): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await deriveAdminSessionToken(secret);
  return safeEqual(cookieValue, expected);
}
