
"use client";

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
import { Badge } from "@/components/ui/badge";
import { Booking } from "@/lib/mock-data";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { getBookings, updateBookingStatus, updatePaymentStatus } from "@/lib/services/bookingService";
import { getUsers, AppUser } from "@/lib/services/userService";

type BookingStatus = Booking['status'];
type PaymentStatus = Booking['paymentStatus'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [allBookings, allUsers] = await Promise.all([
        getBookings(),
        getUsers()
      ]);
      setBookings(allBookings);
      setUsers(allUsers);
    }
    fetchData();
  }, []);

  const handleBookingStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    await updateBookingStatus(bookingId, newStatus);
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };
  
  const handlePaymentStatusChange = async (bookingId: string, newStatus: PaymentStatus) => {
    await updatePaymentStatus(bookingId, newStatus);
    // Refetch to get updated status which might have been changed by the service
     const [allBookings, allUsers] = await Promise.all([
        getBookings(),
        getUsers()
      ]);
      setBookings(allBookings);
  }

  const getBookingStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending payment': return 'bg-orange-400';
      case 'confirmed': return 'bg-blue-500';
      case 'shipped': return 'bg-yellow-500';
      case 'delivered': return 'bg-green-500';
      case 'returned': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }

   const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-orange-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Bookings</CardTitle>
        <CardDescription>
          View and manage all customer bookings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Dress</TableHead>
              <TableHead>Rental Period</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>Transaction ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              const customer = users.find(user => user.uid === booking.userId);
              return (
              <TableRow key={booking.id}>
                <TableCell>
                    <div className="font-medium">{customer?.displayName || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">{customer?.email || 'N/A'}</div>
                </TableCell>
                <TableCell>{booking.dress.name}</TableCell>
                <TableCell>
                  {format(new Date(booking.rentalPeriod.from), "MMM d, yyyy")} - {" "}
                  {format(new Date(booking.rentalPeriod.to), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium">₹{booking.totalAmount.toFixed(2)}</span>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="outline" size="sm" className="flex items-center gap-2 capitalize w-fit">
                                <Badge variant="default" className={getPaymentStatusColor(booking.paymentStatus) + ' text-white'}>{booking.paymentStatus}</Badge>
                                 <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                               <DropdownMenuRadioGroup
                                value={booking.paymentStatus}
                                onValueChange={(newStatus) => handlePaymentStatusChange(booking.id, newStatus as PaymentStatus)}
                              >
                                <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="paid">Paid</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="failed">Failed</DropdownMenuRadioItem>
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                    </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="outline" className="flex items-center gap-2 capitalize">
                        <Badge variant="default" className={getBookingStatusColor(booking.status) + ' text-white'}>{booking.status}</Badge>
                         <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                       <DropdownMenuRadioGroup
                        value={booking.status}
                        onValueChange={(newStatus) => handleBookingStatusChange(booking.id, newStatus as BookingStatus)}
                      >
                        <DropdownMenuRadioItem value="pending payment">Pending Payment</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="confirmed">Confirmed</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="shipped">Shipped</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="delivered">Delivered</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="returned">Returned</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                 <TableCell className="font-mono">{booking.transactionId || 'N/A'}</TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
