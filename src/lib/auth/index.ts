import { getSession } from "./session";
import { AppError } from "../errors/app-error";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw AppError.unauthorized();
  }
  return user;
}

export { getSession, requireSession } from "./session";
