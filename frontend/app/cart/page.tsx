"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/Context/auth-context';
import { useProduct } from "@/lib/Context/product.context";
import { ArrowLeft } from "lucide-react";


export default function CartPage() {
    const router = useRouter();
    const { setCart, cart } = useProduct();

    const subtotal = useMemo(() => {
        return cart.reduce((s, item) => s + item.price * item.quantity, 0);
    }, [cart]);

    const changeQuantity = (id: string, delta: number) => {
        setCart(
            cart.map((item) =>
                item._id === id ? { ...item, quantity: item.quantity + delta } : item
            )
        );
    };

    const removeFromCart = (id: string) => {
        const updatedCart = cart.filter((item) => item._id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    const handleCheckout = () => {
        // router.push('/checkout');
    };

    return (
        <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-8">
            <div className="container mx-auto px-4">
                <Link href="/">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Button>
                </Link>
                <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>
                {cart.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-slate-700 mb-4">Your cart is empty.</p>
                        <Link href="/">
                            <Button className="bg-emerald-600 hover:bg-emerald-700">Continue Shopping</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            {cart.map(item => (
                                <div key={item._id} className="flex items-center bg-white shadow-sm rounded-lg p-4">
                                    <div className="w-24 h-24 bg-slate-100 rounded overflow-hidden flex items-center justify-center mr-4">
                                        {item.imageUrl ? (

                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-slate-400">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-slate-500">${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="text-sm text-slate-600">${(item.price * item.quantity).toFixed(2)}</div>
                                        </div>

                                        <div className="mt-3 flex items-center space-x-3">
                                            <div className="flex items-center border rounded">
                                                <button className="px-3 py-1" onClick={() => item.quantity > 1 ? changeQuantity(item._id, -1) : null}>-</button>
                                                <div className="px-4 py-1">{item.quantity}</div>
                                                <button className="px-3 py-1" onClick={() => changeQuantity(item._id, 1)}>+</button>
                                            </div>

                                            <button className="text-red-600 text-sm" onClick={() => removeFromCart(item._id)}>Remove</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className="bg-white rounded-lg shadow-sm p-6">
                            <h4 className="text-lg font-medium mb-4">Order Summary</h4>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-600">Subtotal</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-4">
                                <span className="text-sm text-slate-600">Shipping</span>
                                <span className="text-sm text-slate-600">Calculated at checkout</span>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 mb-3" onClick={handleCheckout}>Proceed to checkout</Button>
                                <Button variant="ghost" className="w-full" onClick={clearCart}>Clear cart</Button>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}
