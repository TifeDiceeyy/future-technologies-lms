/**
 * DefineAuthChallenge trigger
 * Controls the flow of the custom auth challenge for magic link / email OTP.
 */
export const handler = async (event) => {
  const sessions = event.request.session;

  if (sessions.length === 0) {
    // No previous challenges — issue the first custom challenge
    event.response.issueTokens = false;
    event.response.failAuthentication = false;
    event.response.challengeName = "CUSTOM_CHALLENGE";
  } else if (
    sessions.length === 1 &&
    sessions[0].challengeName === "CUSTOM_CHALLENGE" &&
    sessions[0].challengeResult === true
  ) {
    // OTP was correct — issue tokens
    event.response.issueTokens = true;
    event.response.failAuthentication = false;
  } else {
    // Wrong answer or too many attempts
    event.response.issueTokens = false;
    event.response.failAuthentication = true;
  }

  return event;
};
