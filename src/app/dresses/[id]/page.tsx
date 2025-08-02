
import { getDressById, getProducts } from "@/lib/services/productService";
import DressDetailPageContent from "./DressDetailPageContent";
import { notFound } from "next/navigation";

export default async function DressDetailPage({ params: { id } }: { params: { id: string } }) {
  const dressData = await getDressById(id);
  
  if (!dressData) {
    notFound();
  }

  let relatedProductsData = [];
  // Fetch related products if their IDs are specified in the dress data
  if (dressData.relatedProductIds && dressData.relatedProductIds.length > 0) {
      const allProducts = await getProducts(); 
      relatedProductsData = allProducts.filter(p => dressData.relatedProductIds?.includes(p.id));
  }

  return (
   <DressDetailPageContent 
     dressId={id}
     initialDress={dressData} 
     relatedProducts={relatedProductsData}
   />
  );
}
