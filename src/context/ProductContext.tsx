import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
    ReactNode,
} from 'react';
import { Product, MAX_PRODUCTS } from '../types';
import { scheduleSlotNotification, scheduleLimitNotification } from '../utils/notification';

interface ProductState {
    products: Product[];
    isLimitReached: boolean;
    lastAddedId: string | null;
}

const initialState: ProductState = {
    products: [],
    isLimitReached: false,
    lastAddedId: null,
};

type Action =
    | { type: 'ADD_PRODUCT'; payload: Product }
    | { type: 'REMOVE_PRODUCT'; payload: string }
    | { type: 'UPDATE_PRODUCT'; payload: Product }
    | { type: 'CLEAR_LAST_ADDED' };

function productReducer(state: ProductState, action: Action): ProductState {
    switch (action.type) {
        case 'ADD_PRODUCT': {
            const products = [...state.products, action.payload];
            return {
                ...state,
                products,
                isLimitReached: products.length >= MAX_PRODUCTS,
                lastAddedId: action.payload.id,
            };
        }
        case 'REMOVE_PRODUCT': {
            const products = state.products.filter((p) => p.id !== action.payload);
            return {
                ...state,
                products,
                isLimitReached: products.length >= MAX_PRODUCTS,
            };
        }
        case 'UPDATE_PRODUCT': {
            const products = state.products.map((p) =>
                p.id === action.payload.id ? action.payload : p
            );
            return { ...state, products };
        }
        case 'CLEAR_LAST_ADDED':
            return { ...state, lastAddedId: null };
        default:
            return state;
    }
}

interface ProductContextValue {
    state: ProductState;
    addProduct: (product: Product) => Promise<void>;
    removeProduct: (id: string) => void;
    updateProduct: (product: Product) => void;
    clearLastAdded: () => void;
    remainingSlots: number;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(productReducer, initialState);

    const remainingSlots = MAX_PRODUCTS - state.products.length;

    const addProduct = useCallback(
        async (product: Product) => {
            dispatch({ type: 'ADD_PRODUCT', payload: product });

            const newCount = state.products.length + 1;

            if (newCount >= MAX_PRODUCTS) {
                await scheduleLimitNotification();
            } else if (newCount === MAX_PRODUCTS - 1) {
                await scheduleSlotNotification(1);
            }
        },
        [state.products.length]
    );

    const removeProduct = useCallback((id: string) => {
        dispatch({ type: 'REMOVE_PRODUCT', payload: id });
    }, []);

    const updateProduct = useCallback((product: Product) => {
        dispatch({ type: 'UPDATE_PRODUCT', payload: product });
    }, []);

    const clearLastAdded = useCallback(() => {
        dispatch({ type: 'CLEAR_LAST_ADDED' });
    }, []);

    return (
        <ProductContext.Provider
            value={{ state, addProduct, removeProduct, updateProduct, clearLastAdded, remainingSlots }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const ctx = useContext(ProductContext);
    if (!ctx) throw new Error('useProducts must be used within ProductProvider');
    return ctx;
}