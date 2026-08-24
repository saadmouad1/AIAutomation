import { nextAuthProvider } from "./nextauth-adapter";
import { AppError } from "../errors/app-error";

export async function getSession() {
  return nextAuthProvider.getSession();
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw AppError.unauthorized();
  }
  return session;
}
