import { NextResponse } from "next/server";
import products from '../../../../data/products.json'
import { ProductsArray, Product } from "@/types/productsTypes";

const productsArray: ProductsArray = products.products as Product[];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  if (mode === "count-categories") {
    const uniqueCategories = [
      ...new Set(
        productsArray
          .map((product) => product.category)
          .filter(Boolean)
      )
    ]
    return NextResponse.json({categories: uniqueCategories})
  }
}