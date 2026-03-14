// ─── PreSignUp Cognito Trigger ────────────────────────────────────────────────
// Auto-confirms admin/teacher accounts so they skip email verification.
// Student accounts still go through normal email verification.

export const handler = async (event) => {
  if (event.request.userAttributes["custom:role"] === "admin") {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true;
  }
  return event;
};
