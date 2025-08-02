import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
      <Card>
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
          <CardTitle className="text-4xl font-headline">About Prency Hangers</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
          <p>
            Welcome to Prency Hangers, your ultimate destination for renting stylish attire. Our mission is to provide a seamless and affordable way for everyone to access beautiful, high-quality outfits without the commitment of a purchase.
          </p>
          <p>
            Founded by a group of passionate fashion enthusiasts, we understand the excitement of dressing up for special occasions. We saw a need for a modern solution that combines style with convenience, allowing you to wear a different stunning outfit for every event without breaking the bank.
          </p>
          <p>
            Our collection features a curated selection of dresses, suits, and accessories, each piece handpicked for its design, quality, and modern appeal. We believe that everyone deserves to feel amazing, and our rental service makes that dream a reality.
          </p>
          <p>
            Thank you for choosing Prency Hangers. We can't wait to be a part of your celebrations!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
