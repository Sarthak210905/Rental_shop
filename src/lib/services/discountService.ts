
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, limit } from 'firebase/firestore';
import { Discount } from '@/lib/mock-data';

export async function getDiscounts(): Promise<Discount[]> {
  const discountsCol = collection(db, 'discounts');
  const discountSnapshot = await getDocs(discountsCol);
  const discountList = discountSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discount));
  return discountList.sort((a, b) => new Date(b.expiry).getTime() - new Date(a.expiry).getTime());
}

export async function getDiscountById(id: string): Promise<Discount | null> {
    const docRef = doc(db, "discounts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Discount;
    } else {
        return null;
    }
}

export async function getDiscountByCode(code: string): Promise<Discount | null> {
    if (!code) return null;
    const discountsCol = collection(db, 'discounts');
    const q = query(discountsCol, where("code", "==", code.toUpperCase()), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Discount;
}


export async function addDiscount(discountData: Omit<Discount, 'id'>): Promise<void> {
    await addDoc(collection(db, "discounts"), discountData);
}

export async function updateDiscount(id: string, discountData: Partial<Omit<Discount, 'id'>>): Promise<void> {
    const docRef = doc(db, "discounts", id);
    await updateDoc(docRef, discountData);
}

export async function deleteDiscount(id: string): Promise<void> {
    const docRef = doc(db, "discounts", id);
    await deleteDoc(docRef);
}
