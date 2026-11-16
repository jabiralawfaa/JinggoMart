import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "BUYER" ? "/" : "/dashboard");

  return (
    <div className="auth-wrap">
      <AuthForm mode="login" />
    </div>
  );
}
