import { Amplify } from "aws-amplify";

const isLocal =
  typeof window !== "undefined" && window.location.hostname === "localhost";

export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_6WcGxO6Jl",
      userPoolClientId: "6j9ncna26oc3jm9mcc7pv25q61",
      loginWith: {
        email: true,
        oauth: {
          domain: "us-east-16wcgxo6jl.auth.us-east-1.amazoncognito.com",
          scopes: ["email", "openid", "profile"],
          redirectSignIn: [
            isLocal ? "http://localhost:5173/" : "https://mindcampus.space/",
          ],
          redirectSignOut: [
            isLocal ? "http://localhost:5173/" : "https://mindcampus.space/",
          ],
          responseType: "code" as const,
        },
      },
    },
  },
};

export const API_BASE_URL =
  "https://lx2i5gpnc9.execute-api.us-east-1.amazonaws.com/prod";

export function configureAmplify() {
  Amplify.configure(awsConfig);
}
