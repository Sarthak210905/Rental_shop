
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { User, Mail, MapPin, AlertCircle, Truck, QrCode, Hash } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRequireAuth, useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { differenceInCalendarDays } from "date-fns";
import { addBooking, getBookings } from "@/lib/services/bookingService";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Booking } from "@/lib/mock-data";


const checkoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "A valid ZIP code is required"),
  transactionId: z.string().min(5, "Please enter a valid Transaction ID"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions to proceed.",
  }),
});

const STANDARD_SHIPPING_FEE = 150.00;
const SECURITY_DEPOSIT_PER_ITEM = 2000.00;


export default function CheckoutPage() {
  const { user, appUser, loading: authLoading } = useRequireAuth();
  const { cartItems, clearCart, cartCount } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  
  const [shippingCost, setShippingCost] = useState<number>(STANDARD_SHIPPING_FEE);
  const [isDeliverable, setIsDeliverable] = useState(true);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      transactionId: "",
      termsAccepted: false,
    },
  });

  useEffect(() => {
    if (appUser) {
      form.reset({
        fullName: appUser.displayName || "",
        email: appUser.email || "",
        address: appUser.address || "",
        city: appUser.city || "",
        state: appUser.state || "",
        zip: appUser.zip || "",
        transactionId: "",
        termsAccepted: false,
      })
    }
  }, [appUser, form]);


  const city = form.watch("city");
  const zip = form.watch("zip");

  useEffect(() => {
    const cityLower = city.trim().toLowerCase();
    if (cityLower && cityLower !== 'indore') {
      setIsDeliverable(false);
      setShippingCost(0);
    } else {
      setIsDeliverable(true);
      if (zip === '452011') {
        setShippingCost(0);
      } else {
        setShippingCost(STANDARD_SHIPPING_FEE);
      }
    }
  }, [city, zip]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      let itemTotal = 0;
      if (item.rentalPeriod) {
        const rentalDays =
          differenceInCalendarDays(
            new Date(item.rentalPeriod.to),
            new Date(item.rentalPeriod.from)
          ) + 1;
        itemTotal = item.product.price * rentalDays;
      } else {
        itemTotal = item.product.price;
      }
      return acc + itemTotal;
    }, 0);
  }, [cartItems]);

  const totalSecurityDeposit = useMemo(() => {
    return cartItems.length * SECURITY_DEPOSIT_PER_ITEM;
  }, [cartItems]);
  
  const taxes = 0 * 0.1;

  const finalTotal = useMemo(() => {
    return subtotal + taxes + (isDeliverable ? shippingCost : 0) + totalSecurityDeposit;
  }, [subtotal, taxes, shippingCost, isDeliverable, totalSecurityDeposit]);

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    if (!user || !appUser) return;
    
    try {
        // Create bookings for all items in the cart
        for (const item of cartItems) {
            if (item.rentalPeriod) {
                 await addBooking({
                    userId: user.uid,
                    dress: {
                        id: item.product.id,
                        name: item.product.name,
                        imageUrl: item.product.imageUrl
                    },
                    rentalPeriod: {
                        from: new Date(item.rentalPeriod.from),
                        to: new Date(item.rentalPeriod.to),
                    },
                    status: 'pending payment',
                    paymentStatus: 'pending',
                    totalAmount: finalTotal,
                    transactionId: values.transactionId,
                    productType: 'style' in item.product ? 'dresses' : 'jewelry'
                }, appUser);
            }
        }
        
        toast({
            title: "Order Placed!",
            description: "Your order has been placed and is awaiting payment confirmation. We'll notify you once it's verified."
        });

        clearCart();
        router.push('/dashboard/bookings');

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Order Failed",
            description: error.message || "There was an error placing your order. Please try again."
        });
    }
  }

  useEffect(() => {
    // Redirect if cart is empty after loading
    if (!authLoading && cartCount === 0) {
      router.push('/');
    }
  }, [authLoading, cartCount, router]);
  
  if (authLoading || cartCount === 0) {
      return (
          <div className="container mx-auto px-4 py-8 md:py-16">
               <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-12 w-1/3" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="lg:col-span-1">
                    <Skeleton className="h-96 w-full" />
                </div>
               </div>
          </div>
      )
  }
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold font-headline mb-2">Checkout</h1>
            <p className="text-muted-foreground mb-8">
            Complete your order by providing your shipping and payment details.
            </p>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id="checkout-form">
                <Card>
                <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Priya Kumar" {...field} className="pl-10"/>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="priya@example.com" {...field} className="pl-10"/>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="123 Garba Lane" {...field} className="pl-10"/>
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input placeholder="Indore" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                            <Input placeholder="Madhya Pradesh" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                            <Input placeholder="452010" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                      <CardTitle>Payment via UPI</CardTitle>
                      <CardDescription>
                          Scan the QR code with your UPI app or use the UPI ID below.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border">
                          {/* In a real app, you would generate a dynamic QR code */}
                          <Image src="/qrcode.png" data-ai-hint="qr code" alt="UPI QR Code" width={192} height={192} />
                      </div>
                      <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Pay to UPI ID:</p>
                              <p className="font-mono font-semibold text-lg text-primary">prencyhanger</p>
                          </div>
                           <div className="space-y-1">
                              <p className="text-sm text-muted-foreground">Amount to Pay:</p>
                              <p className="font-bold text-2xl">₹{finalTotal.toFixed(2)}</p>
                          </div>
                          <FormField
                            control={form.control}
                            name="transactionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>UPI Transaction ID</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                          <Input placeholder="Enter the transaction ID after payment" {...field} className="pl-10"/>
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                          />
                      </div>
                  </CardContent>
                </Card>

                <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            I agree to the{" "}
                            <Link href="/rental-policy" target="_blank" className="underline text-primary hover:text-primary/80">
                                rental policy and terms of service
                            </Link>
                            .
                            </FormLabel>
                            <FormMessage />
                        </div>
                        </FormItem>
                    )}
                />

                <div className="lg:hidden">
                 <Button type="submit" size="lg" className="w-full" disabled={!isDeliverable || !form.getValues("termsAccepted") || form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Placing Order..." : "I have paid, Confirm my Order"}
                 </Button>
                </div>
            </form>
            </Form>
        </div>
        <div className="lg:col-span-1">
             <Card className="sticky top-24">
                <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span>Taxes & Fees</span>
                    <span>₹{taxes.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                    <span>Shipping</span>
                     <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                        {isDeliverable ? (shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`) : 'N/A'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Security Deposit</span>
                    <span>₹{totalSecurityDeposit.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{finalTotal.toFixed(2)}</span>
                </div>
                
                {!isDeliverable && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Delivery Unavailable</AlertTitle>
                        <AlertDescription>
                            We're sorry, we currently only deliver to Indore.
                        </AlertDescription>
                    </Alert>
                )}
                </CardContent>
                <CardFooter className="flex-col gap-4">
                 <Button type="submit" form="checkout-form" size="lg" className="w-full" disabled={!isDeliverable || !form.getValues("termsAccepted") || form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Placing Order..." : "I have paid, Confirm my Order"}
                 </Button>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4"/>
                    <span>Delivery to Indore only</span>
                 </div>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
