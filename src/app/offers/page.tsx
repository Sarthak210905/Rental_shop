

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Discount } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { getDiscounts } from "@/lib/services/discountService";

export default function OffersPage() {
    const { toast } = useToast();
    const [discounts, setDiscounts] = useState<Discount[]>([]);

    useEffect(() => {
        async function fetchDiscounts() {
            const activeDiscounts = await getDiscounts();
            setDiscounts(activeDiscounts.filter(d => d.status === 'active'));
        }
        fetchDiscounts();
    }, []);
  
    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Copied!",
            description: `Discount code "${code}" has been copied to your clipboard.`,
        });
    };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-headline font-bold">Special Offers & Discounts</h1>
            <p className="text-muted-foreground mt-2">
                Use these codes at checkout to enjoy discounts on your rentals.
            </p>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {discounts.map((offer) => (
          <Card key={offer.code} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-6 w-6 text-primary" />
                <span>{offer.title}</span>
              </CardTitle>
              <CardDescription>{offer.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <span className="font-mono text-lg font-bold text-primary">{offer.code}</span>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(offer.code)}>
                  <Copy className="h-5 w-5" />
                   <span className="sr-only">Copy code</span>
                </Button>
              </div>
            </CardContent>
             <div className="p-4 pt-0 text-xs text-muted-foreground text-center">
                <p>Expires on: {new Date(offer.expiry).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
