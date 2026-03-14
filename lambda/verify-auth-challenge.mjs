/**
 * VerifyAuthChallenge trigger
 * Checks the OTP the user submitted against the one stored in privateChallengeParameters.
 */
export const handler = async (event) => {
  const expectedOtp = event.request.privateChallengeParameters.otp;
  const submittedOtp = event.request.challengeAnswer?.trim();

  event.response.answerCorrect = submittedOtp === expectedOtp;

  return event;
};
