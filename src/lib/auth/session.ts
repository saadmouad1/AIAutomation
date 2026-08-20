import { nextAuthProvider } from "./nextauth-adapter";
import { AppError } from "../errors/app-error";

export async function getSession() {
  // Temporary mock session for UI preview without a database
  return {
    user: {
      id: "mock-user-1",
      name: "Saad Mouad",
      email: "saad2003almikhlafi@gmail.com",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
  // return nextAuthProvider.getSession();
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw AppError.unauthorized();
  }
  return session;
}
