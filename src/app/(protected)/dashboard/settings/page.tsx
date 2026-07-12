import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { SettingsContent } from "@/features/settings/settings-content";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <SettingsContent
      name={session.user.name}
      username={session.user.username}
    />
  );
}
