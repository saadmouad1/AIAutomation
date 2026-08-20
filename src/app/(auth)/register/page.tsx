import { RegisterForm } from "@/components/auth/register-form";

export const metadata = {
  title: "Sign Up - AURIVO",
  description: "Create a new AURIVO account.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-dark p-4">
      <RegisterForm />
    </div>
  );
}
