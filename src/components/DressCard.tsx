
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Dress, Jewelry } from "@/lib/mock-data";

type Product = Dress | Jewelry;

type ProductCardProps = {
  dress: Product;
};

const DressCard = ({ dress }: ProductCardProps) => {
  const productLink = 'style' in dress ? `/dresses/${dress.id}` : `/jewelry/${dress.id}`;
  const priceSuffix = 'style' in dress ? "/day" : "/rental";
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 ease-in-out flex flex-col">
      <Link href={productLink}>
        <CardHeader className="p-0">
          <div className="relative">
            <Image
              src={dress.imageUrl}
              alt={dress.name}
              width={400}
              height={400}
              className="object-cover w-full h-auto aspect-square"
              data-ai-hint={dress.hint}
            />
            {dress.availability ? (
                <Badge className="absolute top-2 right-2 bg-green-600 text-white">Available</Badge>
            ) : (
                <Badge variant="destructive" className="absolute top-2 right-2">Rented</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-bold text-lg text-foreground truncate">{dress.name}</h3>
          <p className="text-sm text-muted-foreground">{'style' in dress ? dress.style : 'type' in dress ? dress.type : ''}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-lg font-semibold text-primary">
            ₹{dress.price.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">{priceSuffix}</span>
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default DressCard;
