import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login - AURIVO",
  description: "Sign in to your AURIVO account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-4">
      <LoginForm />
    </div>
  );
}
