
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Jewelry, Product } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Star, Package, ShieldCheck, Calendar as CalendarIcon } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  isBefore,
  format,
  differenceInCalendarDays,
  addDays,
} from "date-fns";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { getJewelryById, getProducts } from "@/lib/services/productService";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function JewelryDetailPage() {
  const params = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [item, setItem] = useState<Jewelry | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [bookingType, setBookingType] = useState<"range" | "single">("range");
  const [range, setRange] = useState<DateRange | undefined>();
  const [singleDate, setSingleDate] = useState<Date | undefined>();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  
   useEffect(() => {
    if (!params.id) return;
    setLoading(true);
    const itemRef = doc(db, "jewelry", params.id as string);
    
    const unsubscribe = onSnapshot(itemRef, async (docSnap) => {
      if (docSnap.exists()) {
        const jewelryItem = { id: docSnap.id, ...docSnap.data() } as Jewelry;
        setItem(jewelryItem);
        // Fetch related products once we have the item data
        const products = await getProducts();
        setRelatedProducts(products.filter(p => p.id !== jewelryItem.id).slice(0, 4));
      } else {
        console.error("Jewelry document not found in real-time listener.");
        setItem(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to jewelry document:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.id]);


  const isDateBlocked = (day: Date) => {
    const dayWithoutTime = new Date(day.setHours(0, 0, 0, 0));
    if (isBefore(dayWithoutTime, new Date(new Date().setHours(0, 0, 0, 0)))) {
      return true;
    }
    
    const dayString = format(dayWithoutTime, 'yyyy-MM-dd');

    return (item?.unavailableDates || []).includes(dayString);
  };
  
  const isRangeBlocked = (start: Date, end: Date) => {
    let currentDate = new Date(start);
    while(currentDate <= end) {
        if(isDateBlocked(currentDate)) return true;
        currentDate = addDays(currentDate, 1);
    }
    return false;
  }

  const rentalDays = useMemo(() => {
    if (bookingType === 'range' && range?.from && range?.to) {
      if (isBefore(range.to, range.from)) return 0;
      return differenceInCalendarDays(range.to, range.from) + 1;
    }
    if (bookingType === 'single' && singleDate) {
      return 1;
    }
    return 0;
  }, [range, singleDate, bookingType]);

  const totalPrice = useMemo(() => {
    if (!item) return 0;
    return item.price * rentalDays;
  }, [item, rentalDays]);

  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  const handleAddToCart = async () => {
    if (!item) return;
    
    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (bookingType === 'range') {
        if (!range?.from || !range?.to) {
            toast({
                variant: "destructive",
                title: "Selection Incomplete",
                description: "Please select both a start and return date.",
            });
            return;
        }
        if (isBefore(range.to, range.from)) {
            toast({
                variant: "destructive",
                title: "Invalid Date Range",
                description: "Return date cannot be before the start date.",
            });
            return;
        }
        if (isRangeBlocked(range.from, range.to)) {
             toast({
                variant: "destructive",
                title: "Dates Unavailable",
                description: "One or more dates in your selected range are already booked. Please choose another range.",
            });
            return;
        }
        fromDate = range.from;
        toDate = range.to;
    } else { // single day
        if (!singleDate) {
             toast({
                variant: "destructive",
                title: "Selection Incomplete",
                description: "Please select a date for your rental.",
            });
            return;
        }
        if(isDateBlocked(singleDate)) {
             toast({
                variant: "destructive",
                title: "Date Unavailable",
                description: "This date is already booked. Please choose another date.",
            });
            return;
        }
        fromDate = singleDate;
        toDate = singleDate;
    }


    const cartItem = {
      product: item,
      rentalPeriod: {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
      },
    };
    addToCart(cartItem);
  };
  
  const isAddToCartDisabled = () => {
    if (!item || !item.availability) return true;
    if (bookingType === 'range') {
      return !range?.from || !range?.to;
    }
    if (bookingType === 'single') {
      return !singleDate;
    }
    return true;
  }
  
  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16">
             <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                <div>
                     <Skeleton className="w-full h-[400px]" />
                     <div className="grid grid-cols-5 gap-2 mt-4">
                        <Skeleton className="w-full h-[80px]" />
                        <Skeleton className="w-full h-[80px]" />
                        <Skeleton className="w-full h-[80px]" />
                        <Skeleton className="w-full h-[80px]" />
                        <Skeleton className="w-full h-[80px]" />
                     </div>
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-8 w-1/4" />
                    <Separator className="my-6" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full mt-8" />
                    <Skeleton className="h-10 w-full mt-8" />
                </div>
             </div>
        </div>
    )
  }

  if (!item) {
    return <div className="container mx-auto py-16 text-center">Jewelry not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
           <Carousel setApi={setApi} className="w-full max-w-md mx-auto" plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
            <CarouselContent>
              {item.images.map((src, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src={src}
                        alt={`${item.name} - view ${index + 1}`}
                        width={400}
                        height={400}
                        className="object-cover w-full h-auto aspect-square"
                        data-ai-hint={item.hint}
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
           <div className="grid grid-cols-5 gap-2 mt-4 max-w-md mx-auto">
                {item.images.map((src, index) => (
                    <button key={index} onClick={() => handleThumbnailClick(index)} className={cn("overflow-hidden rounded-lg border-2", current === index ? "border-primary" : "border-transparent")}>
                        <Image
                        src={src}
                        alt={`${item.name} thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-auto aspect-square"
                        data-ai-hint={item.hint}
                        />
                    </button>
                ))}
            </div>
        </div>

        <div>
          <h1 className="text-4xl font-headline font-bold text-foreground">
            {item.name}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary">{item.type}</Badge>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-primary" fill="currentColor" />
              <Star className="w-5 h-5 text-primary" fill="currentColor" />
              <Star className="w-5 h-5 text-primary" fill="currentColor" />
              <Star className="w-5 h-5 text-primary" fill="currentColor" />
              <Star className="w-5 h-5 text-primary/50" fill="currentColor" />
              <span className="text-sm text-muted-foreground ml-1">
                (12 reviews)
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-primary mt-4">
            ₹{item.price.toFixed(2)}{" "}
            <span className="text-base font-normal text-muted-foreground">
              / day
            </span>
          </p>
          <Separator className="my-6" />
          <p className="text-foreground/80 leading-relaxed">
            {item.description}
          </p>
          
           <div className="mt-8 grid gap-4">
            <Label>Select your rental dates</Label>
            <Tabs value={bookingType} onValueChange={(value) => setBookingType(value as "range" | "single")} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="range">Multiple Days</TabsTrigger>
                <TabsTrigger value="single">Single Day</TabsTrigger>
              </TabsList>
              <TabsContent value="range">
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-range"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !range && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {range?.from ? (
                          range.to ? (
                            <>
                              {format(range.from, "LLL dd, y")} -{" "}
                              {format(range.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(range.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={range?.from}
                        selected={range}
                        onSelect={setRange}
                        numberOfMonths={2}
                        disabled={isDateBlocked}
                      />
                    </PopoverContent>
                  </Popover>
              </TabsContent>
              <TabsContent value="single">
                 <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-single"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !singleDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {singleDate ? (
                           format(singleDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="single"
                        selected={singleDate}
                        onSelect={setSingleDate}
                        disabled={isDateBlocked}
                      />
                    </PopoverContent>
                  </Popover>
              </TabsContent>
            </Tabs>
          </div>
          
          {rentalDays > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-center">Your Rental Period</h4>
              <div className="flex justify-between items-center mt-2">
                 {bookingType === "range" && range?.from && range?.to ? (
                    <>
                       <div>
                          <p className="text-sm text-muted-foreground">From</p>
                          <p className="font-medium">
                            {format(range.from, "MMM d, yyyy")} 2:30 PM
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Return Date</p>
                          <p className="font-medium">
                             {format(range.to, "MMM d, yyyy")} 10:00 AM
                          </p>
                        </div>
                    </>
                 ) : bookingType === "single" && singleDate ? (
                     <div className="w-full text-center">
                        <p className="font-medium">
                          {format(singleDate, "MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">Delivery by 2:30 PM, Return next day by 10:00 AM</p>
                     </div>
                 ) : null}
              </div>
              <>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold">
                  <span>
                    Total ({rentalDays} {rentalDays > 1 ? "days" : "day"})
                  </span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </>
            </div>
          )}

          <Button
            size="lg"
            className="w-full mt-8 text-lg"
            onClick={handleAddToCart}
            disabled={isAddToCartDisabled()}
          >
            {item.availability ? 'Add to Cart' : 'Currently Unavailable'}
          </Button>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              <span>Free Shipping & Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span>Secure & Insured</span>
            </div>
          </div>
        </div>
      </div>
       {relatedProducts.length > 0 && (
        <div className="mt-16">
          <Separator className="my-8" />
          <h2 className="text-3xl font-headline font-bold text-center mb-8">
            Complete The Look
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 ease-in-out flex flex-col">
                  <Link href={'style' in product ? `/dresses/${product.id}` : `/jewelry/${product.id}`}>
                      <CardHeader className="p-0">
                      <div className="relative">
                          <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="object-cover w-full h-auto aspect-square"
                          data-ai-hint={product.hint}
                          />
                          {product.availability ? (
                              <Badge className="absolute top-2 right-2 bg-green-600 text-white">Available</Badge>
                          ) : (
                              <Badge variant="destructive" className="absolute top-2 right-2">Rented</Badge>
                          )}
                      </div>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow">
                        <h3 className="font-bold text-lg text-foreground truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{'style' in product ? product.style : 'type' in product ? product.type : ''}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                      <p className="text-lg font-semibold text-primary">
                          ₹{product.price.toFixed(2)}
                          <span className="text-sm font-normal text-muted-foreground">/day</span>
                      </p>
                      </CardFooter>
                  </Link>
                </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
