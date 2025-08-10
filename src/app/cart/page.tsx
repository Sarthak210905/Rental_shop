
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getJewelry } from "@/lib/services/productService";
import { format, differenceInCalendarDays, isBefore } from "date-fns";
import { Trash2, Ticket, Plus, Info, ShoppingBag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState, useMemo } from "react";
import { Dress, Jewelry, Discount } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequireAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { getDiscountByCode } from "@/lib/services/discountService";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { user, loading: authLoading } = useRequireAuth();
  const { cartItems, removeFromCart, cartCount } = useCart();
  const [suggestedJewelry, setSuggestedJewelry] = useState<Jewelry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();


  useEffect(() => {
    async function fetchSuggestions() {
      setDataLoading(true);
      const jewelryData = await getJewelry();
      setSuggestedJewelry(jewelryData.slice(0, 3)); // Suggest 3 jewelry items
      setDataLoading(false);
    }
    fetchSuggestions();
  }, []);

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

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === 'fixed') {
        return appliedDiscount.value;
    }
    if (appliedDiscount.type === 'percentage') {
        return subtotal * (appliedDiscount.value / 100);
    }
    return 0;
  }, [appliedDiscount, subtotal]);

  const securityDeposit = 2000.00;
  const taxes = 0 * 0.1;
  const total = subtotal + taxes + securityDeposit - discountAmount;
  
  const handleApplyDiscount = async () => {
    setIsApplying(true);
    const discount = await getDiscountByCode(discountCode);
    
    if (!discount) {
        toast({ variant: "destructive", title: "Invalid Code", description: "The discount code you entered is not valid." });
        setAppliedDiscount(null);
    } else if (discount.status === 'expired' || new Date(discount.expiry) < new Date()) {
        toast({ variant: "destructive", title: "Expired Code", description: "This discount code has expired." });
        setAppliedDiscount(null);
    } else if (subtotal < discount.minOrderAmount) {
         toast({ variant: "destructive", title: "Minimum Order Not Met", description: `You must spend at least ₹${discount.minOrderAmount.toFixed(2)} to use this code.` });
         setAppliedDiscount(null);
    } else {
        toast({ title: "Discount Applied!", description: `Successfully applied code: ${discount.code}` });
        setAppliedDiscount(discount);
    }

    setIsApplying(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    toast({ title: "Discount Removed" });
  }
  
  const isLoading = authLoading || dataLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl font-bold font-headline mb-8">Your Cart</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null; // Should be redirected by useRequireAuth, this is a fallback.

  if (cartCount === 0) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
            <h1 className="text-3xl font-bold font-headline mt-8">Your Cart is Empty</h1>
            <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="mt-6">
                <Link href="/">Browse Collection</Link>
            </Button>
        </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="text-3xl font-bold font-headline mb-8">Your Cart ({cartCount})</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.product.id} className="flex items-start md:items-center gap-4 p-4 flex-col md:flex-row">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    width={80}
                    height={120}
                    className="rounded-md object-cover"
                    data-ai-hint={item.product.hint}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    {item.rentalPeriod && (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(item.rentalPeriod.from), "MMM d, yyyy")} -{" "}
                        {format(new Date(item.rentalPeriod.to), "MMM d, yyyy")}
                      </p>
                    )}
                     <p className="text-lg font-semibold text-primary mt-1">
                      ₹{item.product.price.toFixed(2)}
                       {item.rentalPeriod && <span className="text-sm font-normal text-muted-foreground">/day</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Look</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestedJewelry.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                          data-ai-hint={item.hint}
                        />
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-primary">₹{item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                    <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedDiscount.code})</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes & Fees</span>
                  <span>₹{taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1.5">
                    Refundable Security Deposit
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">This is refunded after the item is returned and inspected. Charges may apply for damages.</p>
                      </TooltipContent>
                    </Tooltip>
                  </span>
                  <span>₹{securityDeposit.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                    <div className="relative">
                      <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Discount code" 
                        className="pr-24 pl-10" 
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        disabled={!!appliedDiscount}
                      />
                       <Button 
                        type="submit" 
                        size="sm" 
                        className="absolute right-1 top-1/2 -translate-y-1/2"
                        onClick={appliedDiscount ? handleRemoveDiscount : handleApplyDiscount}
                        disabled={isApplying || !discountCode}
                        variant={appliedDiscount ? 'secondary' : 'default'}
                        >
                            {isApplying ? '...' : (appliedDiscount ? 'Remove' : 'Apply')}
                        </Button>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
