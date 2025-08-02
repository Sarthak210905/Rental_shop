import { Gem } from "lucide-react";
import { getJewelry } from "@/lib/services/productService";
import JewelryPageContent from "./JewelryPageContent";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

const JewelryGrid = async () => {
  const jewelry = await getJewelry();
  const uniqueTypes = Array.from(new Set(jewelry.map((j) => j.type)));

  return <JewelryPageContent jewelry={jewelry} uniqueTypes={uniqueTypes} />;
}

const JewelryGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
          </div>
      ))}
  </div>
);

export default async function JewelryPage() {
  return (
    <div className="w-full">
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
             <div className="flex justify-center mb-4 text-primary">
                <Gem size={48} strokeWidth={1.5}/>
            </div>
            <h2 className="text-4xl font-headline font-bold text-foreground">
              Jewelry & Accessories
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Complete your look with our stunning collection of necklaces, earrings, and full sets. The perfect finishing touch for any outfit.
            </p>
          </div>

          <Suspense fallback={<JewelryGridSkeleton />}>
            <JewelryGrid />
          </Suspense>

        </div>
      </section>
    </div>
  );
}
