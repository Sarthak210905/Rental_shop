
"use client"

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Booking } from "@/lib/mock-data";
import { format } from "date-fns";
import BookingStatusStepper from "@/components/dashboard/BookingStatusStepper";
import { useEffect, useState } from "react";
import { getBookings } from "@/lib/services/bookingService";
import { useAuth } from "@/hooks/use-auth";

export default function BookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        if(user?.uid) {
            async function fetchBookings() {
                const userBookings = await getBookings(user?.uid);
                setBookings(userBookings);
            }
            fetchBookings();
        }
    }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
        <CardDescription>
          Track your dress rentals from confirmation to return.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Dress</TableHead>
              <TableHead>Rental Period</TableHead>
              <TableHead className="w-[350px]">Status</TableHead>
              <TableHead>Booking ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center gap-4">
                    <Image
                      src={booking.dress.imageUrl}
                      alt={booking.dress.name}
                      width={60}
                      height={90}
                      className="rounded-md object-cover"
                      data-ai-hint="dress"
                    />
                    <div>
                      <p className="font-medium">{booking.dress.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{format(new Date(booking.rentalPeriod.from), "MMM d, yyyy")}</span>
                    <span className="text-muted-foreground">to</span>
                    <span>{format(new Date(booking.rentalPeriod.to), "MMM d, yyyy")}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <BookingStatusStepper currentStatus={booking.status} />
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">{booking.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
