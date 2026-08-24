"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextAuthProvider = exports.NextAuthAdapter = exports.authOptions = void 0;
const next_auth_1 = require("next-auth");
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const prisma_adapter_1 = require("@auth/prisma-adapter");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("../db/client");
const env_1 = require("../../config/env");
exports.authOptions = {
    adapter: (0, prisma_adapter_1.PrismaAdapter)(client_1.db),
    session: {
        strategy: "jwt",
    },
    secret: env_1.env.NEXTAUTH_SECRET,
    providers: [
        (0, credentials_1.default)({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }
                const user = await client_1.db.user.findUnique({
                    where: { email: credentials.email.toLowerCase() },
                });
                if (!user || !user.passwordHash) {
                    throw new Error("Invalid credentials");
                }
                const isValid = await bcryptjs_1.default.compare(credentials.password, user.passwordHash);
                if (!isValid) {
                    throw new Error("Invalid credentials");
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
    },
    pages: {
        signIn: "/login",
        newUser: "/register",
    },
};
class NextAuthAdapter {
    async getSession() {
        const session = await (0, next_auth_1.getServerSession)(exports.authOptions);
        if (!session?.user?.email)
            return null;
        return {
            user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                image: session.user.image,
            },
            expires: session.expires,
        };
    }
}
exports.NextAuthAdapter = NextAuthAdapter;
exports.nextAuthProvider = new NextAuthAdapter();
