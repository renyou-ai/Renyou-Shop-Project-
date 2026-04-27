import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client("TON_CLIENT_ID_GOOGLE");

export async function verifyGoogleToken(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: "TON_CLIENT_ID_GOOGLE",
  });
  const payload = ticket.getPayload();
  return payload; // email, name, picture...
}