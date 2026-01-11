
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bike,
    Home,
    MapPin,
    Bell,
    Users,
    Wrench,
    ListOrdered,
    CreditCard,
} from "lucide-react";
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/bikes", label: "E-Bike Management", icon: Bike },
    { href: "/dashboard/stations", label: "Stations", icon: MapPin },
    { href: "/dashboard/renters", label: "Renter Management", icon: Users },
    { href: "/dashboard/rentals", label: "Rental Monitoring", icon: ListOrdered },
    { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/maintenance", label: "Maintenance", icon: Wrench },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export function NavLinks() {
    const pathname = usePathname();

    return (
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href} className="w-full">
                        <SidebarMenuButton
                            isActive={pathname === item.href}
                            tooltip={{
                                children: item.label,
                            }}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
