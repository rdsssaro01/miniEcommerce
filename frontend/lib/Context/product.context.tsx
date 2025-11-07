'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { apiGet, apiPost } from "../api";
import { useRouter } from "next/navigation";

type ProductContextType = {
    userToken: string | null;
    loading: boolean;
    page: number;
    perpage: number;
    products: Product[];
    totalPages: number;
    fetchData: () => Promise<void>;
    handlePrev: () => Promise<void>;
    handleNext: () => Promise<void>;
    search: string;
    setSearch: (search: string) => void;
    setCart: (cart: Product[]) => void;
    cart: Product[];
    addToCart: (product: Product) => void;
};



export type Product = {
    _id: string;
    name: string;
    price: number;
    description: string | null;
    image_url: string | null;
    quantity: number;
    featured: boolean;
    stock: number;
    category: string;
    createdAt: string;
    updatedAt: string;
};

export type Category = {
    id: string;
    name: string;
    description: string | null;
};


const ProductContext = createContext<ProductContextType | undefined>(undefined);
export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalpages] = useState(1);
    const [perpage, setPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState<Product[]>([]);

    const router = useRouter();
    useEffect(() => {
        const userToken = localStorage.getItem("token");
        if (!userToken) {
            router.replace("/login");
            return;
        }
        fetchData();
        getCartDtails();
    }, [page, totalPages]);



    const getCartDtails = () => {
        if (typeof window !== "undefined") {
            const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCart(savedCart);
        }
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            const queryString = new URLSearchParams({
                page: page.toString(),
                perPage: perpage.toString(),
                search: search
            }).toString();

            const fullUrl = `products?${queryString}`;

            const res = await apiGet(fullUrl, true);
            if (res?.products) {
                setProducts(res.products);
                setPage(res.page);
                setTotalpages(res.totalPages);
            }
        } catch (err) {
            console.error('Failed to fetch products', err);
        } finally {
            setLoading(false);
        }
    };


    const handlePrev = async () => {
        setPage(page - 1);
        fetchData()
    };
    const handleNext = async () => {
        setPage(page + 1);
        console.log("dfgdfgdfg", page);
        fetchData();
    };

    const addToCart = (product: Product) => {
        let updatedCart = [...cart];
        const existingItem = updatedCart.find((item) => item._id === product._id);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            updatedCart.push({ ...product, quantity: 1 });
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    return (
        <ProductContext.Provider value={
            {
                loading, fetchData, handlePrev,
                handleNext, userToken, page, totalPages,
                products, perpage, search, setSearch,
                setCart, cart, addToCart

            }
        }>
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an ProductProvider');
    }
    return context;
}