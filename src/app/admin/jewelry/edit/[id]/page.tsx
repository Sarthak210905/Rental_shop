
import { getJewelryById } from "@/lib/services/productService";
import JewelryEditForm from "../JewelryEditForm";
import { notFound } from "next/navigation";

export default async function EditJewelryPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const isNewProduct = id === 'new';
    let jewelryData = null;

    if (!isNewProduct) {
        if (id) {
            jewelryData = await getJewelryById(id);
            if (!jewelryData) {
                notFound();
            }
        }
    }

    return <JewelryEditForm initialData={jewelryData} isNewProduct={isNewProduct} />;
}
