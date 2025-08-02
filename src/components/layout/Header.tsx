
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth.tsx";
import { useCart } from "@/hooks/use-cart";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Menu, User, ShoppingBag, LogOut, LayoutDashboard, Shield, Gem, Home, Shirt } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#inventory", label: "Dresses", icon: Shirt },
  { href: "/jewelry", label: "Jewelry", icon: Gem },
];

const Header = () => {
    const { user, loading, isAdmin } = useAuth();
    const { cartCount } = useCart();
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

    const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="hidden md:flex items-center space-x-6 ml-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
           {user && (
             <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              My Dashboard
            </Link>
           )}
           {isAdmin && (
             <Link
              href="/admin"
              className="text-sm font-medium text-destructive transition-colors hover:text-destructive/80 flex items-center gap-2"
            >
              <Shield size={16} />
              Admin Panel
            </Link>
           )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {cartCount}
                    </span>
                )}
                <span className="sr-only">Shopping Bag</span>
            </Link>
          </Button>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4">
                  <Logo />
                  <div className="flex flex-col space-y-2 pt-4">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                    {user && (
                       <SheetClose asChild>
                        <Link
                          href="/dashboard"
                          className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                        >
                          Dashboard
                        </Link>
                      </SheetClose>
                    )}
                    {isAdmin && (
                       <SheetClose asChild>
                        <Link
                          href="/admin"
                          className="text-lg font-medium text-destructive transition-colors hover:text-primary"
                        >
                          Admin
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2 pt-6">
                    {user ? (
                        <SheetClose asChild>
                            <Button onClick={handleLogout}>Logout</Button>
                        </SheetClose>
                    ) : (
                        <>
                        <SheetClose asChild>
                        <Button asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        </SheetClose>
                        <SheetClose asChild>
                        <Button variant="outline" asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                        </SheetClose>
                        </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center space-x-2">
             {!loading && user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL || `https://placehold.co/40x40/FF9933/FFFFFF?text=${userInitial}`} alt={user.displayName || user.email || ""} />
                                <AvatarFallback>{userInitial}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/profile">
                                <User className="mr-2 h-4 w-4"/> Profile
                            </Link>
                        </DropdownMenuItem>
                         {isAdmin && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/admin">
                                        <Shield className="mr-2 h-4 w-4" /> Admin
                                    </Link>
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4"/> Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                 </DropdownMenu>
             ) : !loading ? (
                <>
                    <Button asChild>
                    <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild>
                    <Link href="/signup">Sign Up</Link>
                    </Button>
                </>
             ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
