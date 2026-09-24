import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ToastHost } from "@/components/ui/Toast";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Sidebar fullName={user.fullName} />
      <main className="flex-1 overflow-y-auto bg-neutral-950 px-4 py-6 sm:px-10 sm:py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
      <ToastHost />
    </div>
  );
}
