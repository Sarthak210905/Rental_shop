
export type Dress = {
  id: string; // Changed to string for Firestore document IDs
  name: string;
  style: string;
  price: number;
  imageUrl: string;
  images: string[];
  description: string;
  availability: boolean;
  hint: string;
  relatedProductIds?: string[]; // Changed to string for Firestore document IDs
  unavailableDates?: string[]; // Array of date strings 'yyyy-MM-dd'
};

export type Jewelry = {
  id: string; // Changed to string for Firestore document IDs
  name: string;
  type: string;
  price: number;
  imageUrl: string;
  images: string[];
  description: string;
  availability: boolean;
  hint: string;
  unavailableDates?: string[]; // Array of date strings 'yyyy-MM-dd'
};

export type Product = Dress | Jewelry;

export type Booking = {
  id: string; // Firestore document ID
  userId: string;
  dress: { 
    id: string;
    name: string; 
    imageUrl: string; 
  };
  rentalPeriod: {
    from: string; // Storing as ISO string
    to: string; // Storing as ISO string
  };
  status: 'pending payment' | 'confirmed' | 'shipped' | 'delivered' | 'returned';
  paymentStatus: 'paid' | 'pending' | 'failed';
  totalAmount: number;
  transactionId?: string;
};

export type Discount = {
  id: string; // Firestore document ID
  code: string;
  title: string;
  description: string;
  expiry: string; // Storing as ISO string
  status: 'active' | 'expired';
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
};


// Mock data is no longer used, it will be fetched from Firestore.
// You will need to add data to your Firestore database.
// You can use the Firebase console to add documents to 'dresses', 'jewelry', 'bookings', and 'discounts' collections.

export const dresses: Dress[] = [];
export const jewelry: Jewelry[] = [];
export const bookings: Booking[] = [];
export const products: Product[] = [];
export const discounts: Discount[] = [];
