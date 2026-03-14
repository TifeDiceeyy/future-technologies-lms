// ─── Teacher invite code ──────────────────────────────────────────────────────
// Generates a deterministic 8-char uppercase hex code from a teacher's email.
// The same function is used to generate (admin side) and validate (signup side).
// Rotating SECRET invalidates all existing codes.
const SECRET = "MINDCAMPUS_TEACHER_KEY_2024";

export async function generateTeacherCode(email: string): Promise<string> {
  const data = email.toLowerCase().trim() + "|" + SECRET;
  const encoded = new TextEncoder().encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const bytes = new Uint8Array(hashBuffer);
  return Array.from(bytes.slice(0, 4))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
}
