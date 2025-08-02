
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
  Users,
  Settings,
  LogOut,
  ShoppingBag,
  ClipboardList,
  Ticket,
  Gem,
  PanelLeft,
  Home
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import AdminAuthGuard from "@/components/auth/AdminAuthGuard";


const AdminSidebarContent = () => {
    const pathname = usePathname();
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut(auth);
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        router.push("/login");
    };

    const isActive = (path: string, exact: boolean = false) => {
      if (exact) return pathname === path;
      return pathname.startsWith(path);
    }
    const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A";
    
    return (
        <>
            <SidebarHeader>
                <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/admin", true)} tooltip="Dashboard">
                            <Link href="/admin"><LayoutGrid /><span>Dashboard</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/admin/products")} tooltip="Dresses">
                             <Link href="/admin/products"><ShoppingBag /><span>Dresses</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/admin/jewelry")} tooltip="Jewelry">
                            <Link href="/admin/jewelry"><Gem /><span>Jewelry</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/admin/bookings")} tooltip="Bookings">
                            <Link href="/admin/bookings"><ClipboardList /><span>Bookings</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/admin/discounts")} tooltip="Discounts">
                            <Link href="/admin/discounts"><Ticket /><span>Discounts</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/admin/customers")} tooltip="Customers">
                            <Link href="/admin/customers"><Users /><span>Customers</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={isActive("/admin/settings")} tooltip="Settings">
                            <Link href="/admin/settings"><Settings /><span>Settings</span></Link>
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
                        <AvatarImage src={user?.photoURL || `https://placehold.co/40x40/FF9933/FFFFFF?text=${userInitial}`} alt={user?.displayName || "Admin User"} />
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.displayName || "Admin User"}</p>
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

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const getPageTitle = () => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length === 1) return 'Dashboard';
        const lastSegment = segments[segments.length - 1];
        if (lastSegment === 'new' || !isNaN(Number(lastSegment))) {
            const parent = segments[segments.length - 2];
            return `${lastSegment === 'new' ? 'Add' : 'Edit'} ${parent.charAt(0).toUpperCase() + parent.slice(1, -1)}`;
        }
        return lastSegment.replace('-', ' ');
    }

    return (
        <AdminAuthGuard>
            <SidebarProvider>
                <div className="flex min-h-screen bg-muted/50">
                    <Sidebar>
                        <AdminSidebarContent />
                    </Sidebar>
                    <SidebarInset>
                        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                           <SidebarTrigger className="md:hidden"/>
                           <h1 className="flex-1 text-xl font-headline font-semibold capitalize">
                                {getPageTitle()}
                           </h1>
                        </header>
                        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-4 md:gap-8">
                            {children}
                        </main>
                    </SidebarInset>
                </div>
            </SidebarProvider>
        </AdminAuthGuard>
    );
}
