
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
  Users,
  Settings,
  LogOut,
  ShoppingBag,
  ClipboardList,
  Ticket,
  Gem
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


export default function AdminDashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
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

  const isActive = (path: string) => pathname.startsWith(path);
  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A";


  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/admin"}
                  tooltip="Dashboard"
                >
                  <Link href="/admin">
                    <LayoutGrid />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/products")}
                  tooltip="Dresses"
                >
                  <Link href="/admin/products">
                    <ShoppingBag />
                    <span>Dresses</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/jewelry")}
                  tooltip="Jewelry"
                >
                  <Link href="/admin/jewelry">
                    <Gem />
                    <span>Jewelry</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/bookings")}
                  tooltip="Bookings"
                >
                  <Link href="/admin/bookings">
                    <ClipboardList />
                    <span>Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/discounts")}
                  tooltip="Discounts"
                >
                  <Link href="/admin/discounts">
                    <Ticket />
                    <span>Discounts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/customers")}
                  tooltip="Customers"
                >
                  <Link href="/admin/customers">
                    <Users />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/admin/settings")}
                  tooltip="Settings"
                >
                  <Link href="#">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL || `https://placehold.co/40x40/FF9933/FFFFFF?text=${userInitial}`} alt={user?.displayName || "Admin User"} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-semibold">{user?.displayName || "Admin User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
                  <LogOut className="h-4 w-4"/>
                </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-2xl font-headline font-bold capitalize">
              {pathname.split("/").pop()?.replace("-", " ") === 'products' ? 'Dresses' : pathname.split("/").pop()?.replace("-", " ")}
            </h1>
          </header>
          <div className="p-4 md:p-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
