'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/Context/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Package, ShoppingCart, Star, Truck, Shield, Share, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { apiGet } from '@/lib/api';
import { Category, Product, useProduct } from '@/lib/Context/product.context';



export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useProduct();


  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    setLoading(true);
    const res = await apiGet(`products/${params.id}`, true)

    if (res != null) {

      setProduct(res);
    } else {
      console.error('Failed to fetch products');
    }

    setLoading(false);
  };

  const handleAddToCart = (product: Product) => {

    addToCart(product);
    toast.success('Added to cart successfully!');
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (!isFavorite) {

      localStorage.setItem(
        "favorites",
        JSON.stringify([...favorites, product])
      );
    } else {

      const updated = favorites.filter((item: any) => item._id !== product!._id);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product!.name,
        text: "Check out this amazing product!",
        url: window.location.href,
      });
    } catch (error) {
      console.log("Share not supported or cancelled.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <Toaster />
      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative">
              {product.featured && (
                <Badge className="absolute top-4 left-4 z-10 bg-amber-500 hover:bg-amber-600">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  Featured
                </Badge>
              )}
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-32 w-32 text-slate-300" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              {category && (
                <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                  {category.name}
                </Badge>
              )}
              <Share className="h-5 w-5 text-slate-600 cursor-pointer float-right" onClick={handleShare} />
              <Heart className={`h-5 w-5 cursor-pointer float-right mr-4 ${isFavorite ? 'text-red-600 fill-red-600' : 'text-slate-600'}`} onClick={handleFavorite} />

              <div>
                <h1 className="text-4xl font-bold mb-3">{product.name}</h1>
                <p className="text-3xl font-bold text-emerald-600">${product.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center space-x-4">
                {product.stock > 0 ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    In Stock ({product.stock} available)
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.description || 'No detailed description available for this product.'}
                </p>
              </div>

              <Card className="p-6 bg-slate-50 border-slate-200">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Truck className="h-5 w-5 mr-3 text-emerald-600" />
                    <span>Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="h-5 w-5 mr-3 text-emerald-600" />
                    <span>30-day return policy</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-5 w-5 mr-3 text-emerald-600" />
                    <span>Quality guaranteed</span>
                  </div>
                </div>
              </Card>

              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg py-6"
                disabled={product.stock === 0}
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
