import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

// Pending orders are saved before payment without a razorpayPaymentId, so the old
// full unique index on that field must become a partial one (only real payment IDs).
async function migrateOrderIndexes() {
  const [{ Order }, { connectToDatabase }] = await Promise.all([
    import("../app/models/order"),
    import("../lib/mongodb"),
  ]);

  await connectToDatabase();

  const indexes = await Order.collection.indexes().catch(() => []);
  const paymentIndex = indexes.find((index) => index.name === "razorpayPaymentId_1");

  if (paymentIndex && !paymentIndex.partialFilterExpression) {
    await Order.collection.dropIndex("razorpayPaymentId_1");
    console.log("Dropped old razorpayPaymentId_1 unique index.");
  }

  await Order.createIndexes();
  console.log("Order indexes are up to date.");
}

migrateOrderIndexes()
  .catch((error: unknown) => {
    console.error("Order index migration failed.", error instanceof Error ? error.message : "Unknown error.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
