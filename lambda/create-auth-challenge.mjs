import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const ses = new SESClient({ region: "us-east-1" });

const OTP_TABLE = "mindcampus-magic-otps";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@futuretechnologies.dev";

/**
 * CreateAuthChallenge trigger
 * Generates a 6-digit OTP, stores it in DynamoDB with a 10-minute TTL,
 * and emails it to the user via SES.
 */
export const handler = async (event) => {
  const email = event.request.userAttributes.email;

  // Generate 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const ttl = Math.floor(Date.now() / 1000) + 600; // 10 minutes

  // Store in DynamoDB
  await dynamo.send(new PutCommand({
    TableName: OTP_TABLE,
    Item: { email, otp, ttl },
  }));

  // Send via SES (wrapped — SES sandbox failures must not kill the challenge)
  try { await ses.send(new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "Your Future Technologies sign-in code" },
      Body: {
        Text: {
          Data: `Your sign-in code is: ${otp}\n\nThis code expires in 10 minutes. If you didn't request this, you can ignore this email.`,
        },
        Html: {
          Data: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
              <h2 style="color:#7c3aed;margin-bottom:8px">Your sign-in code</h2>
              <p style="color:#555;margin-bottom:24px">Use the code below to sign in to Future Technologies.</p>
              <div style="background:#f5f3ff;border:1px solid #ddd5ff;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
                <span style="font-size:32px;font-weight:700;letter-spacing:0.2em;color:#7c3aed">${otp}</span>
              </div>
              <p style="color:#888;font-size:13px">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        },
      },
    },
  })); } catch (sesErr) {
    console.error("SES send failed (sandbox/unverified address?):", sesErr.message);
  }

  // Pass the OTP in private parameters (used by VerifyAuthChallenge)
  event.response.publicChallengeParameters = { email };
  event.response.privateChallengeParameters = { otp };
  event.response.challengeMetadata = "EMAIL_OTP";

  return event;
};
