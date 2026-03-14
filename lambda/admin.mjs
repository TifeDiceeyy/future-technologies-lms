import {
  CognitoIdentityProviderClient,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
const USER_POOL_ID = "us-east-1_6WcGxO6Jl";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: { ...CORS, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS, body: "" };
  }

  const path = event.pathParameters ?? {};
  const studentId = path.studentId;
  const route = event.resource ?? event.path ?? "";

  if (!studentId) {
    return respond(400, { error: "studentId is required" });
  }

  try {
    if (route.endsWith("/disable")) {
      await client.send(
        new AdminDisableUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: studentId,
        }),
      );
      return respond(200, { success: true, action: "disabled", studentId });
    }

    if (route.endsWith("/enable")) {
      await client.send(
        new AdminEnableUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: studentId,
        }),
      );
      return respond(200, { success: true, action: "enabled", studentId });
    }

    return respond(404, { error: "Unknown route" });
  } catch (err) {
    console.error("Admin action error:", err);
    return respond(500, { error: err.message ?? "Internal server error" });
  }
};
