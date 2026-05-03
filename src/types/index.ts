export interface Product {
    id: string;
    name: string;
    price: number;
    imageUri: string | null;
    createdAt: string;
    currency: string;
}

export interface ProductFormData {
    name: string;
    price: string;
    imageUri: string | null;
    currency: string;
}

export type RootStackParamList = {
    Shelf: undefined;
    AddProduct: undefined;
    ProductDetail: { productId: string };
};

export const MAX_PRODUCTS = 5;
export const CURRENCIES = ['$', '€', '£', '₦', '¥'];