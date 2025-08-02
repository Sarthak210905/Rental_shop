
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Package,
  UserCircle,
  Settings,
  LogOut,
  Home
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRequireAuth } from "@/hooks/use-auth.tsx";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


const DashboardSidebarContent = () => {
    const pathname = usePathname();
    const { user } = useRequireAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        await signOut(auth);
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        router.push("/");
    };

    const isActive = (path: string) => pathname === path;
    const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?";
    
    return (
        <>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
                            <Link href="/dashboard"><LayoutGrid /><span>Dashboard</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/dashboard/bookings")} tooltip="My Bookings">
                            <Link href="/dashboard/bookings"><Package /><span>My Bookings</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/dashboard/profile")} tooltip="Profile">
                            <Link href="/dashboard/profile"><UserCircle /><span>Profile</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")} tooltip="Settings">
                            <Link href="/dashboard/settings"><Settings /><span>Settings</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className="border-t -mx-2 pt-2">
                     <SidebarMenu>
                         <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Back to Site">
                                <Link href="/"><Home /><span>Back to Site</span></Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                     </SidebarMenu>
                 </div>
                <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent/50">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.photoURL || `https://placehold.co/40x40/FF9933/FFFFFF?text=${userInitial}`} alt={user?.displayName || "User"} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.displayName || "User"}</p>
                        <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent" onClick={handleLogout}>
                        <LogOut className="h-4 w-4"/>
                    </Button>
                </div>
            </SidebarFooter>
        </>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { loading } = useRequireAuth();
    const pathname = usePathname();
    const pageTitle = pathname.split("/").pop()?.replace("-", " ") || "Dashboard";

    if (loading) {
        return null; // Or a loading spinner
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-muted/50">
                <Sidebar>
                    <DashboardSidebarContent />
                </Sidebar>
                <SidebarInset>
                     <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                        <SidebarTrigger className="md:hidden"/>
                        <h1 className="flex-1 text-xl font-headline font-semibold capitalize">
                            {pageTitle}
                        </h1>
                    </header>
                    <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-4 md:gap-8">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
