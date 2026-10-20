import { products as bundledProducts, type Product as ProductData } from "@/app/data/products";
import { Product } from "@/app/models/product";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/mongodb";

let warned = false;

// Without a working database (e.g. a fresh clone with no .env.local) the storefront
// shows the bundled catalog instead of crashing.
async function loadProducts(filter: Record<string, string>): Promise<ProductData[]> {
  if (isDatabaseConfigured()) {
    try {
      await connectToDatabase();
      return (await Product.find(filter).select("-_id").lean()) as ProductData[];
    } catch (error) {
      console.error("Product database unavailable; showing the bundled catalog.", error);
    }
  } else if (!warned) {
    warned = true;
    console.warn("MONGODB_URI is not set; showing the bundled catalog. Copy .env.example to .env.local to connect a database.");
  }

  return bundledProducts.filter((product) =>
    Object.entries(filter).every(([key, value]) => product[key as keyof ProductData] === value),
  );
}

export function getProducts(category?: string) {
  return loadProducts(category ? { category } : {});
}

export async function getProduct(id: string) {
  return (await loadProducts({ id }))[0] ?? null;
}
