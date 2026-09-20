import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";
import { products } from "../app/data/products";

loadEnvConfig(process.cwd());

async function seedProducts() {
  const [{ Product }, { connectToDatabase }] = await Promise.all([
    import("../app/models/product"),
    import("../lib/mongodb"),
  ]);

  await connectToDatabase();

  const operations = products.map((product) => ({
    updateOne: {
      filter: { id: product.id },
      update: { $set: product },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(operations, { ordered: false });
  const changedCount = result.upsertedCount + result.modifiedCount;

  console.log(`Product seed complete: ${products.length} processed, ${changedCount} inserted or updated.`);
}

seedProducts()
  .catch((error: unknown) => {
    console.error("Product seed failed.", error instanceof Error ? error.message : "Unknown error.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
