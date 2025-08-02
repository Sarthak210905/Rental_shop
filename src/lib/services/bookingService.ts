
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, query, where, addDoc, serverTimestamp, Timestamp, runTransaction } from 'firebase/firestore';
import { Booking } from '@/lib/mock-data';
import { getDressById } from './productService';
import { AppUser } from './userService';
import { Resend } from 'resend';

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config({ path: '.env.local' });
}

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;


type NewBooking = {
  userId: string;
  dress: { 
    id: string;
    name: string; 
    imageUrl: string; 
  };
  rentalPeriod: {
    from: Date;
    to: Date;
  };
  status: 'pending payment';
  paymentStatus: 'pending'; // Default to pending for manual verification
  totalAmount: number;
  transactionId: string;
  productType: 'dresses' | 'jewelry';
}

// This function now securely creates a booking document and updates the product's unavailable dates.
export async function addBooking(bookingData: NewBooking, appUser: AppUser): Promise<void> {
    const productRef = doc(db, bookingData.productType, bookingData.dress.id);
    const bookingCol = collection(db, "bookings");

    try {
        await runTransaction(db, async (transaction) => {
            const productDoc = await transaction.get(productRef);
            if (!productDoc.exists()) {
                throw new Error("Product document does not exist!");
            }

            const newUnavailableDates = [];
            let currentDate = new Date(bookingData.rentalPeriod.from);
            currentDate.setUTCHours(0,0,0,0);
            const endDate = new Date(bookingData.rentalPeriod.to);
            endDate.setUTCHours(0,0,0,0);

            while(currentDate <= endDate) {
                newUnavailableDates.push(currentDate.toISOString().split('T')[0]);
                currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
            }
            
            const existingDates = productDoc.data().unavailableDates || [];
            const allUnavailableDates = [...new Set([...existingDates, ...newUnavailableDates])];

            const newBookingRef = doc(bookingCol);
            transaction.set(newBookingRef, {
                 ...bookingData,
                rentalPeriod: {
                    from: Timestamp.fromDate(bookingData.rentalPeriod.from),
                    to: Timestamp.fromDate(bookingData.rentalPeriod.to),
                },
                createdAt: serverTimestamp()
            });

            transaction.update(productRef, { unavailableDates: allUnavailableDates });
            
            // Send email directly using Resend
            if (resend) {
                await resend.emails.send({
                    from: 'onboarding@resend.dev', // Replace with your verified sender domain
                    to: appUser.email,
                    subject: `Your Prency Hangers Order is Awaiting Confirmation! (Order #${newBookingRef.id})`,
                    html: `
                        <h1>Thank you for your order, ${appUser.displayName}!</h1>
                        <p>We've received your order and it's currently awaiting payment confirmation. We'll notify you again as soon as your order is confirmed.</p>
                        <h2>Order Summary:</h2>
                        <ul>
                            <li><strong>Product:</strong> ${bookingData.dress.name}</li>
                            <li><strong>Rental Period:</strong> ${bookingData.rentalPeriod.from.toLocaleDateString()} to ${bookingData.rentalPeriod.to.toLocaleDateString()}</li>
                            <li><strong>Total Amount:</strong> ₹${bookingData.totalAmount.toFixed(2)}</li>
                            <li><strong>Transaction ID:</strong> ${bookingData.transactionId}</li>
                        </ul>
                        <p>You can view your order details here: <a href="https://prency-hangers-app.web.app/dashboard/bookings">My Bookings</a></p>
                        <p>Thanks for choosing Prency Hangers!</p>
                    `,
                });
            } else {
                console.warn("Resend API key not found. Skipping email confirmation.");
            }
        });
    } catch (e) {
        console.error("Transaction or email sending failed: ", e);
        // We throw a generic error to the user to avoid exposing implementation details.
        throw new Error("Failed to create booking or send confirmation email. Please try again.");
    }
}


export async function getBookings(userId?: string): Promise<Booking[]> {
  const bookingsCol = collection(db, 'bookings');
  
  let q;
  if (userId) {
      q = query(bookingsCol, where("userId", "==", userId));
  } else {
      q = query(bookingsCol);
  }
  
  const bookingSnapshot = await getDocs(q);
  const bookingList = bookingSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
          rentalPeriod: {
              from: (data.rentalPeriod.from as Timestamp).toDate().toISOString(),
              to: (data.rentalPeriod.to as Timestamp).toDate().toISOString(),
          }
      } as Booking;
  }).sort((a, b) => new Date(b.rentalPeriod.from).getTime() - new Date(a.rentalPeriod.from).getTime());
  return bookingList;
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
        status: status
    });
}

export async function updatePaymentStatus(bookingId: string, newStatus: Booking['paymentStatus']): Promise<void> {
    const bookingRef = doc(db, "bookings", bookingId);
    const updateData: { paymentStatus: Booking['paymentStatus'], status?: Booking['status'] } = {
        paymentStatus: newStatus
    };

    if (newStatus === 'paid') {
        updateData.status = 'confirmed';
    }

    await updateDoc(bookingRef, updateData);
}
