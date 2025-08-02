
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ClipboardList, Users, DollarSign, ArrowRight } from "lucide-react";
import { getBookings } from "@/lib/services/bookingService";
import { getProducts } from "@/lib/services/productService";
import { useEffect, useState } from "react";
import { Booking, Product } from "@/lib/mock-data";
import { getUsers, AppUser } from "@/lib/services/userService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AdminDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [bookingsData, productsData, usersData] = await Promise.all([
                    getBookings(),
                    getProducts(),
                    getUsers()
                ]);
                
                setBookings(bookingsData);
                setProducts(productsData);
                setCustomers(usersData.filter(u => u.role === 'customer'));
            } catch (error) {
                console.error("Failed to fetch admin dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const totalRevenue = bookings
        .filter(booking => booking.status === 'returned' && booking.paymentStatus === 'paid')
        .reduce((acc, booking) => acc + booking.totalAmount, 0);

    const activeBookingsCount = bookings.filter(
        (b) => b.status === "confirmed" || b.status === "shipped" || b.status === "delivered"
    ).length;
    
    const recentBookings = bookings.slice(0, 5);

    const totalProducts = products.length;
    const totalCustomers = customers.length;

    const StatsCard = ({ title, value, icon: Icon, description, isLoading }: { title: string, value: string | number, icon: React.ElementType, description: string, isLoading: boolean }) => (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{description}</p>
            </>
          )}
        </CardContent>
      </Card>
    );

    return (
        <div className="grid gap-4 md:gap-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <StatsCard 
                    title="Total Revenue" 
                    value={`₹${totalRevenue.toFixed(2)}`} 
                    icon={DollarSign} 
                    description="From completed rentals"
                    isLoading={loading}
                />
                <StatsCard 
                    title="Active Bookings" 
                    value={activeBookingsCount} 
                    icon={ClipboardList} 
                    description="Confirmed or in transit"
                    isLoading={loading}
                />
                 <StatsCard 
                    title="Total Products" 
                    value={totalProducts} 
                    icon={ShoppingBag} 
                    description="Dresses and jewelry items"
                    isLoading={loading}
                />
                 <StatsCard 
                    title="Total Customers" 
                    value={totalCustomers} 
                    icon={Users} 
                    description="All registered customers"
                    isLoading={loading}
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>A list of the most recent customer bookings.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-6 w-32"/></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24"/></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20"/></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto"/></TableCell>
                                </TableRow>
                            )) : recentBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>
                                        <div className="font-medium">{customers.find(c => c.uid === booking.userId)?.displayName || 'N/A'}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            {customers.find(c => c.uid === booking.userId)?.email || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell>{booking.dress.name}</TableCell>
                                    <TableCell>
                                        <Badge className="text-xs" variant={booking.status === 'returned' ? 'secondary' : 'default'}>
                                            {booking.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">₹{booking.totalAmount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter>
                    <div className="text-xs text-muted-foreground">
                        Showing <strong>{recentBookings.length}</strong> of <strong>{bookings.length}</strong> bookings.
                    </div>
                     <Button asChild size="sm" className="ml-auto gap-1">
                        <Link href="/admin/bookings">
                            View All
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
