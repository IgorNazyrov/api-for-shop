import { NextResponse } from "next/server";
import { z } from "zod";
import products from "../../../data/products.json";

type ProductsArray = Product[];

interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: {
    rating?: number;
    comment?: string;
    date?: string;
    reviewerName?: string;
    reviewerEmail?: string;
  }[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt?: string;
    updatedAt?: string;
    barcode?: string;
    qrCode?: string;
  };
  images?: [string];
  thumbnail?: string;
}

const productShema = z.object({
  title: z.string().min(2, "Название слишком короткое"),
  category: z.string().optional(),
  price: z.number().positive("Цена должна быть выше 0")
});

const productsArray: ProductsArray = products.products as Product[]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const filteredProducts = category
    ? productsArray.filter((p) => p.category === category)
    : productsArray;

  return NextResponse.json(filteredProducts);
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
      stock: 99,
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
    void error
    return NextResponse.json(
      { error: "Ошибка при создании продукта" },
      { status: 500 }
    );
  }
}
