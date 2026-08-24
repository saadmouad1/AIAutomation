"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const user_repository_1 = require("../repositories/user.repository");
const app_error_1 = require("../lib/errors/app-error");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
});
class AuthService {
    async register(input) {
        const validated = registerSchema.safeParse(input);
        if (!validated.success) {
            throw app_error_1.AppError.validation(validated.error.flatten().fieldErrors);
        }
        const { email, password, name } = validated.data;
        const existingUser = await (0, user_repository_1.findUserByEmail)(email);
        if (existingUser) {
            throw app_error_1.AppError.conflict("A user with this email already exists");
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const user = await (0, user_repository_1.createUser)({
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
exports.AuthService = AuthService;
exports.authService = new AuthService();
