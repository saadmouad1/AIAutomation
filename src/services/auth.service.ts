import { createUser, findUserByEmail } from "../repositories/user.repository";
import { AppError } from "../lib/errors/app-error";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export class AuthService {
  async register(input: RegisterInput) {
    const validated = registerSchema.safeParse(input);
    
    if (!validated.success) {
      throw AppError.validation(validated.error.flatten().fieldErrors);
    }

    const { email, password, name } = validated.data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw AppError.conflict("A user with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await createUser({
      email,
      passwordHash,
      name,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}

export const authService = new AuthService();
