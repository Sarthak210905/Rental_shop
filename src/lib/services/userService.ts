
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export type UserRole = 'customer' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  role: UserRole;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export async function getUsers(): Promise<AppUser[]> {
  const usersCol = collection(db, 'users');
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => doc.data() as AppUser);
  return userList;
}

export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        role: role
    });
}

export async function updateUserProfile(uid: string, data: Partial<Omit<AppUser, 'email' | 'uid' | 'role'>>): Promise<void> {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
}
