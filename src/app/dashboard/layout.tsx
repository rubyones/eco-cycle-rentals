
'use client';

import Link from "next/link"
import {
  CircuitBoard,
  LogOut,
  Loader2,
} from "lucide-react"

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { NavLinks } from "./nav-links"
import { FirebaseClientProvider, useUser } from "@/firebase"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <div className="inline-block rounded-lg bg-sidebar-accent p-2 text-sidebar-accent-foreground">
                <CircuitBoard className="h-6 w-6" />
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
  );
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FirebaseClientProvider>
      <DashboardContent>
        {children}
      </DashboardContent>
    </FirebaseClientProvider>
  )
}
