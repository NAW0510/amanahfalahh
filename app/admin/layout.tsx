import { auth } from "@/lib/auth"
import AdminSidebar from "./sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        userName={session?.user?.name}
        userEmail={session?.user?.email}
      />
      <main className="flex-1 ml-[220px] min-h-screen flex flex-col">
        {children}
      </main>
    </div>
  )
}
