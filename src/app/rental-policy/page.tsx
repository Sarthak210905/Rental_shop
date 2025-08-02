import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RentalPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-headline text-center">Rental Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none text-foreground/80 leading-relaxed space-y-4">
          <div>
            <h3 className="font-bold text-xl font-headline text-foreground">1. Rental Period</h3>
            <p>Our standard rental period is for 4 days. The period begins on the day your item is delivered and ends on the day you ship it back to us. Extended rentals may be possible for an additional fee, subject to availability.</p>
             <p className="mt-2 p-3 bg-muted rounded-md text-sm"><strong>Note on One-Day Rentals:</strong> For single-day bookings (e.g., for July 31st), the dress will be delivered by 4:00 PM on the rental day. The return must be initiated by 10:00 AM the following morning. A late fee of ₹100 per hour will be applied for returns made after 10:00 AM.</p>
          </div>
          <div>
            <h3 className="font-bold text-xl font-headline text-foreground">2. Security Deposit</h3>
            <p>We require a security deposit for all rentals. This deposit is fully refundable and will be returned to you after the item is returned to us and inspected. The inspection process is typically completed within 3-5 business days of receiving the return.</p>
          </div>
          <div>
            <h3 className="font-bold text-xl font-headline text-foreground">3. Shipping and Returns</h3>
            <p>We offer complimentary shipping both ways. You will receive your outfit in a ready-to-wear condition. For returns, simply place the item in the provided pre-paid return packaging and drop it off at the designated courier before the end of your rental period.</p>
          </div>
          <div>
            <h3 className="font-bold text-xl font-headline text-foreground">4. Sizing and Fit</h3>
            <p>Most of our outfits are 'free size' with adjustable elements. We provide detailed measurements in our Sizing Guide. If an item doesn't fit, please contact us immediately under our Fit Guarantee. We cannot offer refunds for fit issues once the event date has passed.</p>
          </div>
          <div>
            <h3 className="font-bold text-xl font-headline text-foreground">5. Care and Damages</h3>
            <p>We handle all the cleaning and dry cleaning. Please do not attempt to clean the garments yourself. Minor wear and tear, like a loose thread or a missing bead, is expected and covered. However, you are responsible for significant damage (e.g., large stains, rips, tears), missing pieces, or loss of the item. In such cases, the cost of repair or replacement will be deducted from your security deposit.</p>
          </div>
           <div>
            <h3 className="font-bold text-xl font-headline text-foreground">6. Cancellations</h3>
            <p>You may cancel your rental for a full refund up to 14 days before your rental period begins. Cancellations made within 14 days of the rental period will receive a credit for a future rental. No refunds or credits will be issued once an item has been shipped.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
