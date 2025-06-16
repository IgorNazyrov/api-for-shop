import { NextResponse } from "next/server";
import { z } from "zod";
import products from "../../../data/products.json";
import { ProductsArray, Product } from "@/types/productsTypes";


const productShema = z.object({
  title: z.string().min(2, "Название слишком короткое"),
  category: z.string().optional(),
  price: z.number().positive("Цена должна быть выше 0"),
});

const productsArray: ProductsArray = products.products as Product[];

export async function GET() {
  return NextResponse.json(productsArray);
}

export async function POST(request: Request) {
  try {
    const rawData = await request.json();

    const validation = productShema.safeParse(rawData);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const newProduct = {
      id: productsArray.length + 1,
      description: "",
      discountPercentage: 0,
      rating: 0,
      tags: [],
      brand: "",
      sku: `SKU-${Date.now()}`,
      ...validation.data,
    };

    productsArray.push(newProduct);

    return NextResponse.json(
      { success: true, product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    void error;
    return NextResponse.json(
      { error: "Ошибка при создании продукта" },
      { status: 500 }
    );
  }
}
