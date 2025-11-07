'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Star } from 'lucide-react';
import { apiGet } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { set } from 'date-fns';
import { se } from 'date-fns/locale';
import { Category, Product, useProduct } from '@/lib/Context/product.context';



export default function Home() {

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { loading, fetchData, handlePrev, handleNext, userToken, page, totalPages, products, perpage } = useProduct();

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to FITZDO</h1>
          <p className="text-xl text-emerald-50 mb-8">Discover amazing products at unbeatable prices</p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-slate-100">
            <a href="#products">Browse Products</a>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      {/* {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Star className="mr-2 h-8 w-8 text-amber-500 fill-amber-500" />
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.slice(0, 3).map((product) => (
              <ProductCard key={product._id} product={product} featured />
            ))}
          </div>
        </section>
      )} */}

      {/* All Products */}
      <section id="products" className="container mx-auto px-4 py-5">
        {/* Categories */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">All Products</h2>
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className={`cursor-pointer ${selectedCategory === null ? 'bg-emerald-600 hover:bg-emerald-700' : 'hover:bg-slate-100'}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  className={`cursor-pointer ${selectedCategory === category.id ? 'bg-emerald-600 hover:bg-emerald-700' : 'hover:bg-slate-100'}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(perpage)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
            <p className="text-slate-500">Check back later for new items</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                size="sm"
                disabled={page === 1}
                onClick={handlePrev}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300"
              >
                Previous
              </Button>
              <span className="text-slate-700 font-medium">
                Page {page} of {totalPages}
              </span>
              <Button
                size="sm"
                disabled={page === totalPages}
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  return (
    <Link href={`/products/${product._id}`}>
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <CardHeader className="p-0 relative">
          {featured && (
            <Badge className="absolute top-2 right-2 z-10 bg-amber-500 hover:bg-amber-600">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Featured
            </Badge>
          )}
          <div className="aspect-square bg-slate-100 overflow-hidden rounded-t-lg">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-16 w-16 text-slate-300" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-slate-600 text-sm mb-2 line-clamp-2">
            {product.description || 'No description available'}
          </p>
          <p className="text-2xl font-bold text-emerald-600">${product.price.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Details</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
