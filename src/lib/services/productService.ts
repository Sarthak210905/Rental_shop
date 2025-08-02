
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, documentId, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Dress, Jewelry, Product } from '@/lib/mock-data';

type CollectionName = 'dresses' | 'jewelry';

export async function getProducts(ids?: string[]): Promise<Product[]> {
    const dresses = await getDresses(ids);
    const jewelry = await getJewelry(ids);
    return [...dresses, ...jewelry];
}

export async function getDresses(ids?: string[]): Promise<Dress[]> {
  const dressesCol = collection(db, 'dresses');
  let q = query(dressesCol);
  if (ids && ids.length > 0) {
      q = query(dressesCol, where(documentId(), 'in', ids));
  }
  const dressSnapshot = await getDocs(q);
  const dressList = dressSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dress));
  return dressList;
}

export async function getDressById(id: string): Promise<Dress | null> {
    const docRef = doc(db, "dresses", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Dress;
    } else {
        return null;
    }
}


export async function getJewelry(ids?: string[]): Promise<Jewelry[]> {
  const jewelryCol = collection(db, 'jewelry');
  let q = query(jewelryCol);
  if (ids && ids.length > 0) {
      q = query(jewelryCol, where(documentId(), 'in', ids));
  }
  const jewelrySnapshot = await getDocs(q);
  const jewelryList = jewelrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Jewelry));
  return jewelryList;
}

export async function getJewelryById(id: string): Promise<Jewelry | null> {
    const docRef = doc(db, "jewelry", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Jewelry;
    } else {
        return null;
    }
}

export async function addProduct(productData: Omit<Dress, 'id' | 'images' | 'relatedProductIds'>): Promise<void> {
    const productToAdd = {
        ...productData,
        images: [productData.imageUrl], 
        hint: productData.name.toLowerCase().split(' ').slice(0, 2).join(' '),
        relatedProductIds: [],
        unavailableDates: productData.unavailableDates || []
    };

    await addDoc(collection(db, "dresses"), productToAdd);
}

export async function addJewelry(productData: Omit<Jewelry, 'id' | 'images'>): Promise<void> {
    const productToAdd = {
        ...productData,
        images: [productData.imageUrl], 
        hint: productData.name.toLowerCase().split(' ').slice(0, 2).join(' '),
        unavailableDates: productData.unavailableDates || []
    };

    await addDoc(collection(db, "jewelry"), productToAdd);
}

export async function updateProduct(id: string, productData: Partial<Omit<Dress, 'id' | 'images'>>): Promise<void> {
    const docRef = doc(db, "dresses", id);
    const productToUpdate = { ...productData };
    
    // If imageUrl is updated, update the images array as well
    if (productData.imageUrl) {
        (productToUpdate as Dress).images = [productData.imageUrl];
    }
    
    await updateDoc(docRef, productToUpdate);
}

export async function updateJewelry(id: string, productData: Partial<Omit<Jewelry, 'id' | 'images'>>): Promise<void> {
    const docRef = doc(db, "jewelry", id);
    const productToUpdate = { ...productData };
    
    if (productData.imageUrl) {
        (productToUpdate as Jewelry).images = [productData.imageUrl];
    }
    
    await updateDoc(docRef, productToUpdate);
}

export async function deleteProduct(id: string, collectionName: CollectionName): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
}

    