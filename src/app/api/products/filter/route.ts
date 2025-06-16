import products from '../../../../data/products.json'
import { ProductsArray, Product } from '@/types/productsTypes';
import { NextResponse } from 'next/server';

const productsArray: ProductsArray = products.products as Product[];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const filteredProducts = category
    ? productsArray.filter((p) => p.category === category)
    : [];

  return NextResponse.json(filteredProducts);
}