import { NextResponse } from "next/server";
import products from "../../../../data/products.json";
import { ProductsArray, Product } from "@/types/productsTypes";

const productsArray: ProductsArray = products.products as Product[];

export async function GET() {
  try {
    if (!productsArray?.length) throw new Error("No products found");
    const uniqueCategories = [
      ...new Set(
        productsArray.map((product) => product.category).filter(Boolean)
      ),
    ];
    return NextResponse.json({ categories: uniqueCategories });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 500 });
    }
  }
}
