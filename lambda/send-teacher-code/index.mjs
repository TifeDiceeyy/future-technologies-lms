// ─── send-teacher-code Lambda ─────────────────────────────────────────────────
// POST /send-teacher-code  { email: string }
// Generates the deterministic teacher invite code and emails it to the teacher.
// No admin involvement required.

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { createHash } from "crypto";

const ses = new SESv2Client({ region: "us-east-1" });

const FROM_EMAIL = process.env.FROM_EMAIL ?? "noreply@mindcampus.space";

// Must match src/utils/teacherCode.ts SECRET
const SECRET = "MINDCAMPUS_TEACHER_KEY_2024";

function generateTeacherCode(email) {
  const data = email.toLowerCase().trim() + "|" + SECRET;
  return createHash("sha256").update(data).digest("hex").slice(0, 8).toUpperCase();
}

const HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Content-Type": "application/json",
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: HEADERS, body: "" };
  }

  try {
    const { email } = JSON.parse(event.body ?? "{}");

    if (!email || !email.includes("@")) {
      return {
        statusCode: 400,
        headers: HEADERS,
        body: JSON.stringify({ error: "A valid email address is required." }),
      };
    }

    const normalised = email.toLowerCase().trim();
    const code = generateTeacherCode(normalised);

    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: FROM_EMAIL,
        Destination: { ToAddresses: [normalised] },
        Content: {
          Simple: {
            Subject: { Data: "Your MindCampus Teacher Access Code" },
            Body: {
              Html: {
                Data: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden">
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#0891b2);padding:32px;text-align:center">
            <p style="color:#fff;font-size:22px;font-weight:700;margin:0">Future Technologies</p>
            <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:4px 0 0">Teacher Registration</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px">
            <p style="font-size:16px;color:#111827;margin:0 0 12px">Hi there,</p>
            <p style="font-size:14px;color:#6b7280;line-height:1.6;margin:0 0 28px">
              Here is your unique teacher access code for MindCampus. Use it to complete
              your sign-up on the teacher registration page.
            </p>
            <div style="background:#f0f4ff;border:1px solid #c7d7ff;border-radius:12px;padding:28px;text-align:center;margin:0 0 28px">
              <p style="font-size:12px;color:#6b7280;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.08em">Your access code</p>
              <p style="font-family:monospace;font-size:36px;font-weight:700;letter-spacing:0.25em;color:#156ef6;margin:0">${code}</p>
            </div>
            <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0">
              This code is tied to <strong style="color:#6b7280">${normalised}</strong> —
              it won't work for any other email address. If you didn't request this, you
              can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
            <p style="font-size:12px;color:#9ca3af;margin:0;text-align:center">
              © ${new Date().getFullYear()} Future Technologies · mindcampus.space
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
              },
              Text: {
                Data: `Your MindCampus teacher access code is: ${code}\n\nThis code is tied to ${normalised} — it won't work for any other email.\n\nIf you didn't request this, ignore this email.`,
              },
            },
          },
        },
      })
    );

    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({ sent: true }),
    };
  } catch (err) {
    console.error("send-teacher-code error:", err);
    return {
      statusCode: 500,
      headers: HEADERS,
      body: JSON.stringify({ error: "Failed to send code. Please try again." }),
    };
  }
};
