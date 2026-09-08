import { redirect } from "next/navigation";
import LoginScreen from "@/components/auth/LoginScreen";
import { getCurrentUser } from "@/lib/auth/session";

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentUser();
  const resolvedSearchParams = await searchParams;
  const nextPath = resolvedSearchParams.next;

  if (user) {
    redirect(nextPath || "/");
  }

  return <LoginScreen nextPath={nextPath} />;
}
