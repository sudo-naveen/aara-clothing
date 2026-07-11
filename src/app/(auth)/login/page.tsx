import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-6 px-6 py-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm text-white/50">
          Sign in to continue to your dashboard
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
