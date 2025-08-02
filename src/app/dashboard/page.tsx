
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
import { Package, PlusCircle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { getBookings } from "@/lib/services/bookingService";
import { Skeleton } from "@/components/ui/skeleton";
import BookingStatusStepper from "@/components/dashboard/BookingStatusStepper";
import { Booking } from "@/lib/mock-data";
import Image from "next/image";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user, appUser, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      setIsLoadingBookings(true);
      async function fetchUserBookings() {
        const userBookings = await getBookings(user.uid);
        setBookings(userBookings);
        setIsLoadingBookings(false);
      }
      fetchUserBookings();
    } else if (!loading) {
      setIsLoadingBookings(false);
    }
  }, [user, loading]);
  
  const activeBookingsCount = bookings.filter(b => b.status !== 'returned').length;
  const recentBooking = bookings.length > 0 ? bookings[0] : null;

  if (loading) {
    return (
        <div className="grid gap-8">
             <div>
                <Skeleton className="h-9 w-1/2 mb-2" />
                <Skeleton className="h-5 w-3/4" />
            </div>
             <div className="grid md:grid-cols-3 gap-6">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full md:col-span-2" />
            </div>
        </div>
    )
  }

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Hello, {appUser?.displayName?.split(' ')[0] || 'User'}!</h1>
        <p className="text-muted-foreground">
          Welcome back to your dashboard. Here's what's happening.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Bookings</span>
              <Package className="h-6 w-6 text-primary" />
            </CardTitle>
            <CardDescription>Your upcoming and ongoing rentals.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {isLoadingBookings ? <Skeleton className="h-10 w-16" /> : 
              <div className="text-4xl font-bold">{activeBookingsCount}</div>
            }
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard/bookings">View All Bookings</Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Your Next Event</CardTitle>
            {recentBooking ? 
              <CardDescription>Tracking your most recent rental.</CardDescription>
              : <CardDescription>Find the perfect outfit for your next event.</CardDescription>
            }
          </CardHeader>
          <CardContent className="flex-grow">
            {isLoadingBookings ? <Skeleton className="h-24 w-full" /> : 
              recentBooking ? (
                <div className="flex flex-col md:flex-row gap-4 items-start">
                   <Image
                      src={recentBooking.dress.imageUrl}
                      alt={recentBooking.dress.name}
                      width={80}
                      height={120}
                      className="rounded-md object-cover"
                      data-ai-hint="dress"
                    />
                    <div className="flex-1 space-y-2">
                        <p className="font-semibold">{recentBooking.dress.name}</p>
                         <p className="text-sm text-muted-foreground">
                            {format(new Date(recentBooking.rentalPeriod.from), "MMM d, yyyy")} - {format(new Date(recentBooking.rentalPeriod.to), "MMM d, yyyy")}
                         </p>
                        <BookingStatusStepper currentStatus={recentBooking.status} />
                    </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  You have no upcoming bookings. Explore our latest collection of vibrant dresses and elegant Lehengas.
                </p>
              )
            }
          </CardContent>
           <CardFooter>
             <Button asChild variant="outline" className="ml-auto">
              <Link href="/">
                <PlusCircle className="mr-2 h-4 w-4" />
                Browse Collection
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
