'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "../api";
import { useRouter } from "next/navigation";

type ProductContextType = {
    userToken: string | null;
    loading: boolean;
    page: number;
    perpage: number;
    products: Product[];
    totalPages: number;
    fetchData: (pageNum?: number) => Promise<void>;
    handlePrev: () => void;
    handleNext: () => void;
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
    imageUrl: string | null;
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
    const [totalPages, setTotalPages] = useState(1);
    const [perpage, setPerPage] = useState(10);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<Product[]>([]);

    const router = useRouter();

    // Load token and initial data once
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token == null) {
            router.replace("/login");
            return;
        }
        setUserToken(token);
        getCartDetails();
    }, []);

    // Fetch products whenever page or search changes
    useEffect(() => {
        if (userToken != null) {
            fetchData();
        }
    }, [page, search, userToken]);

    const getCartDetails = () => {
        if (typeof window !== "undefined") {
            const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCart(savedCart);
        }
    };

    const fetchData = async () => {
        console.log("Fetching data for page:", page, "search:", search);
        setLoading(true);
        try {
            const queryString = new URLSearchParams({
                page: page.toString(),
                perPage: perpage.toString(),
                search: search,
            }).toString();

            const res = await apiGet(`products?${queryString}`, true);

            if (res?.products) {
                setProducts(res.products);
                setPerPage(res.limit);
                setPage(res.page);
                setTotalPages(res.totalPages);
            }
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrev = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
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
        <ProductContext.Provider
            value={{
                loading,
                fetchData,
                handlePrev,
                handleNext,
                userToken,
                page,
                totalPages,
                products,
                perpage,
                search,
                setSearch,
                setCart,
                cart,
                addToCart,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProduct must be used within a ProductProvider");
    }
    return context;
}
