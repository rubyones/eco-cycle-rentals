import Link from "next/link"
import {
  Bike,
  Home,
  LogOut,
  MapPin,
  Bell,
  Users,
  Wrench,
  ListOrdered,
  Package2,
} from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { NavLinks } from "./nav-links"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="inline-block rounded-lg bg-sidebar-accent p-2 text-sidebar-accent-foreground">
              <Bike className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold tracking-tight font-headline">
              eBike Manager
            </h2>
          </div>
        </SidebarHeader>

        <SidebarContent>
            <NavLinks />
        </SidebarContent>

        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/login" className="w-full">
                        <SidebarMenuButton>
                            <LogOut />
                            <span>Log out</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-4 sm:p-6 bg-background/95">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
