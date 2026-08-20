import { db } from "../lib/db/client";

export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function findUserById(id: string) {
  return db.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name: string;
}) {
  return db.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      name: data.name,
    },
  });
}
